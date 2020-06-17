import React, {Component, useRef, useState} from 'react';
import '../App.css';
import Peer, { RoomStream } from 'skyway-js';
import VideoPlacement from './video/PeerVideoComp';
import { RouteComponentProps } from 'react-router';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import CancelIcon from '@material-ui/icons/Cancel';


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
    }
  }),
);
/*******/

const peer = new Peer({
  key: process.env.REACT_APP_API_KEY!,
  debug: 0
});

let localStream:(MediaStream | undefined) = undefined;

type Props = {} & RouteComponentProps<{roomId: string}>;

const RoomComp: React.FC<Props> = ( props ) => {
  const classes = useStyles();

  const [roomId, setRoomId] = useState(props.match.params.roomId);
  const [callId, setCallId] = useState('');

  const [peerVideos, setPeerVideos] = useState<RoomStream[]>([]);

  // useRefは明示的にvideoElmentを指定する
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const connetPeerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  let memberPeerCount = 0;

  // ローカルのmediaStreamを取得する
  navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then( strem => {
      if (!videoRef.current) return;
      videoRef.current.srcObject = strem;
      localStream = strem;
    })
    .catch( e => { console.log(e);});

  const connectPeer = () => {

    if (!peer.on) {
      return;
    }

    // roomに参加する
    // modeは一旦sfu固定とする
    const room = peer.joinRoom(roomId, {
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

  return (

    <div className={classes.root}>
      <VideoPlacement peerVideos={peerVideos} />
      {/**
        <div ref={remoteVideoRef} className={classes.remoteStreams} id="js-remote-streams"></div>
      */}
      <video id="my-video" className={classes.video} ref={videoRef} autoPlay muted playsInline></video>
      <div className={classes.controller} >
        <Button ref={connetPeerRef} onClick={connectPeer} variant="contained" color="secondary" startIcon={<KeyboardVoiceIcon />}>
            Join Room
        </Button>
        <Button ref={closeRef} variant="contained" color="secondary" startIcon={<CancelIcon />}>
            Left Room
        </Button>
      </div>
    </div>
  );
}

export default RoomComp;