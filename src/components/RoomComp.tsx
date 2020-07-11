import React, {useRef, useState} from 'react'
import '../App.css'
import Peer, { RoomStream } from 'skyway-js'
import VideoPlacement from './video/PeerVideoComp'
import Logout from './Logout'
import { RouteComponentProps } from 'react-router'

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import VolumeOffIcon from '@material-ui/icons/VolumeOff'
import VolumeUpIcon from '@material-ui/icons/VolumeUp'


/** CSS */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
      height: '100%',
      backgroundColor: '#000000',
      display: 'table'
    },
    video: {
      width: '200px',
      height: '150px',
      background: '#eee',
      position: 'fixed',
      right: '50px;',
      bottom: '50px'
    },
    muteVideoFill: {
      width: '200px',
      height: '150px',
      background: '#eee',
      position: 'fixed',
      right: '50px;',
      bottom: '50px',
      display: 'none'
    },
    controller: {
      position: 'fixed',
      left: 'calc(45% - 50px/2)',
      bottom: '50px',
      margin: theme.spacing(1)
    },
    remoteStreams: {
      width: '100%',
      textAlign: 'center',
      display: 'table-cell',
      verticalAlign: 'middle'
    },
    remoteVideos: {
      objectFit: 'contain'
    },
    showButton: {
      display: 'block'
    },
    hideButton: {
      display: 'none'
    }
  }),
);
/*******/

const peer = new Peer({
  key: process.env.REACT_APP_API_KEY!,
  debug: 0
})

let localStream:(MediaStream | undefined) = undefined

type Props = {} & RouteComponentProps<{roomId: string}>;

const RoomComp: React.FC<Props> = ( props ) => {
  const classes = useStyles()
  const [peerVideos, setPeerVideos] = useState<RoomStream[]>([])
  const [roomId, setRoomId] = useState(props.match.params.roomId)

  // useRefは明示的にvideoElmentを指定する
  const videoRef = useRef<HTMLVideoElement>(null)
  const muteRef = useRef<HTMLButtonElement>(null)
  const onRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const muteVideoFillRef = useRef<HTMLDivElement>(null)

  let isMute = false

  // ローカルのmediaStreamを取得する
  navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then( strem => {
      if (!videoRef.current) return;
      videoRef.current.srcObject = strem;
      localStream = strem;
    })
    .catch( e => { console.log(e);});

  const connectPeer = (nowRoomId: string) => {
    if (!peer.on) {
      return;
    }

    // roomに参加する
    // modeは一旦sfu固定とする
    const room = peer.joinRoom(nowRoomId, {
      mode: 'sfu',
      stream: localStream,
    });

    room.once('open', () => {});

    room.on('peerJoin', peerId => {});

    // Render remote stream for new peer join in the room
    room.on('stream', async stream => {

      // stremを取得したタイミングで、stateを更新
      peerVideos.push(stream);
      let tempNewPeerVideos = Object.assign([] , peerVideos);
      setPeerVideos(tempNewPeerVideos);
    });

    // Closeボタン
    closeRef.current?.addEventListener('click', () => {
      room.close();
    });

    room.on('peerLeave', peerId => {
      // peerIdの対象video elementを削除する
      document.getElementById('remote-videos-peerid-' + peerId)?.remove();
    });
  }

  const muteMyVideo = async () => {
    if (isMute) {
      localStream!.getAudioTracks().forEach(track => track.enabled = true)
      localStream!.getVideoTracks().forEach(track => track.enabled = true)

      onRef.current!.setAttribute("style", 'display:none;')
      muteRef.current!.setAttribute("style", 'display:inline-flex;')
      muteVideoFillRef.current!.setAttribute("style", "display:none; ")
      isMute = false
    } else {
      localStream!.getAudioTracks().forEach(track => track.enabled = false)
      localStream!.getVideoTracks().forEach(track => track.enabled = false)

      onRef.current!.setAttribute("style", 'display:inline-flex;')
      muteRef.current!.setAttribute("style", 'display:none;')
      muteVideoFillRef.current!.setAttribute("style", "display:block; ")
      isMute = true
    }
  }

  return (
    <div className={classes.root}>
      <Logout />
      {/** <Form connectPeer={connectPeer} /> **/}
      <VideoPlacement peerVideos={peerVideos} />
      <video id="my-video" className={classes.video} ref={videoRef} autoPlay muted playsInline></video>
      <div ref={muteVideoFillRef} className={classes.muteVideoFill}></div>
      <div className={classes.controller} >
        <Button ref={muteRef} onClick={muteMyVideo} variant="contained" color="secondary" ><VolumeOffIcon /></Button>
        <Button ref={onRef} onClick={muteMyVideo} variant="contained" color="secondary" style={{display:'none'}} ><VolumeUpIcon /></Button>
        <Button ref={closeRef} variant="contained" color="secondary"><ExitToAppIcon /></Button>
      </div>
    </div>
  );
}

export default RoomComp;
