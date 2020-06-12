import React, {Component, useRef, useState} from 'react';
import '../App.css';
import Peer from 'skyway-js';
import FormComp from './FormComp';
import { RouteComponentProps } from 'react-router';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import Button from '@material-ui/core/Button';


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
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    video: {
      width: '200px',
      position: 'fixed',
      right: '50px;',
      bottom: '50px'
    },
    controller: {
      position: 'fixed',
      left: 'calc(50% - 50px/2)',
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

  const [spacing, setSpacing] = React.useState<GridSpacing>(2);
  const classes = useStyles();

  const [roomId, setRoomId] = useState(props.match.params.roomId);
  const [callId, setCallId] = useState('');

  // useRefは明示的にvideoElmentを指定する
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const connetPeerRef = useRef<HTMLButtonElement>(null);

  const gridRef = useRef<any>(null);

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

    room.once('open', () => {
      console.log("=========== open =============");
    });

    room.on('peerJoin', peerId => {
      console.log(`=========== open ${peerId} =============`);
      //memberPeerIds.push(peerId);
    });

    // Render remote stream for new peer join in the room
    room.on('stream', async stream => {
      const newVideo = document.createElement('video');
      newVideo.srcObject = stream;
      newVideo.setAttribute('class', 'remote-videos' );
      
      newVideo.setAttribute('data-peer-id', stream.peerId);
      if (!remoteVideoRef.current) return; 
      remoteVideoRef.current.append(newVideo);
      await newVideo.play().catch(console.error);


      memberPeerCount = memberPeerCount + 1;
      console.log("memberPeerCount = " + memberPeerCount);
      /** videoのサイズ調整 */
      let sizefix = 0;
      if (memberPeerCount == 0) {
        sizefix = 1;
      } else if (memberPeerCount <= 3) {
        sizefix = 2;
      } else {
        sizefix = 4;
      }
      let videoWidth = 100 / sizefix;

      let rvs: any = document.getElementsByClassName('remote-videos');
      console.log(rvs);
      if (rvs.length != 0) {
        for (let item of rvs) {
          item.style.width = videoWidth + "%";
          item.style.height = videoWidth + "%";
        }
      }
    });
  }

  /** Grid内にvideoを追加する */
  const createGridItemElement = ( newVideo: HTMLVideoElement ) => {
    const newGrid = document.createElement('Grid');
    newGrid.setAttribute('item', '');
    newGrid.setAttribute('xs', '12');
    newGrid.setAttribute('ms', '6');
    newGrid.append(newVideo);

    gridRef.current.append(newGrid);

    newVideo.play().catch(console.error);

  };

  return (

    <div className={classes.root}>
      <div ref={remoteVideoRef} className={classes.remoteStreams} id="js-remote-streams"></div>
      <video id="my-video" className={classes.video} ref={videoRef} autoPlay muted playsInline></video>
      <Button className={classes.controller} ref={connetPeerRef} onClick={connectPeer} variant="contained" color="secondary" startIcon={<KeyboardVoiceIcon />}>
          Join Room
      </Button>

    </div>
  );
}

export default RoomComp;