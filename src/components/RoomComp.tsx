import React, {Component, useRef, useState} from 'react';
import '../App.css';
import Peer, { RoomStream } from 'skyway-js';
import Form from './FormComp';
import VideoPlacement from './video/PeerVideoComp';
import { RouteComponentProps } from 'react-router';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';


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
      position: 'fixed',
      right: '50px;',
      bottom: '50px'
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
});

let localStream:(MediaStream | undefined) = undefined;

//type Props = {} & RouteComponentProps<{roomId: string}>;
type Props = {};

const RoomComp: React.FC<Props> = ( props ) => {

  //const roomId = props.match.params.roomId;
  const [roomId, setRoomId] = useState('');
  const classes = useStyles();
  const [peerVideos, setPeerVideos] = useState<RoomStream[]>([]);

  // useRefは明示的にvideoElmentを指定する
  const videoRef = useRef<HTMLVideoElement>(null);
  const muteRef = useRef<HTMLButtonElement>(null);
  const onRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  let isMute = false;

  // ローカルのmediaStreamを取得する
  navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then( strem => {
      if (!videoRef.current) return;
      videoRef.current.srcObject = strem;
      localStream = strem;
    })
    .catch( e => { console.log(e);});

  const connectPeer = (nowRoomId: string) => {
    setRoomId(nowRoomId);
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

  const muteMyVideo = () => {
    if (!videoRef.current) return;
    if (isMute) {
      videoRef.current.removeAttribute('muted');
      onRef.current!.setAttribute("style", 'display:none;')
      muteRef.current!.setAttribute("style", 'display:inline-flex;');
      isMute = false;
    } else {
      videoRef.current.setAttribute('muted', '');
      onRef.current!.setAttribute("style", 'display:inline-flex;')
      muteRef.current!.setAttribute("style", 'display:none;');
      isMute = true;
    }
  }

  return (

    <div className={classes.root}>
      <Form connectPeer={connectPeer} />
      <VideoPlacement peerVideos={peerVideos} />
      <video id="my-video" className={classes.video} ref={videoRef} autoPlay muted playsInline></video>
      <div className={classes.controller} >
        <Button ref={muteRef} onClick={muteMyVideo} variant="contained" color="secondary" startIcon={<VolumeOffIcon />}>
            Mute
        </Button>
        <Button ref={onRef} onClick={muteMyVideo} variant="contained" color="secondary" startIcon={<VolumeUpIcon />} style={{display:'none'}} >
            On
        </Button>
        <Button ref={closeRef} variant="contained" color="secondary" startIcon={<ExitToAppIcon />}>
            Left
        </Button>
        <ExitToAppIcon />
      </div>
    </div>
  );
}

export default RoomComp;