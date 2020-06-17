import React, {Component, useRef, useState} from 'react';
import '../../App.css';
import Peer, { RoomStream } from 'skyway-js';


import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
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

type Props = {
  peerVideos: RoomStream[]
}

const VideoPlacement: React.FC<Props> = ( {peerVideos} ) => {
  const classes = useStyles();
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  //let memberPeerCount = 0;

  //let peerIds: string[] = ['aaa'];
  const [peerIds, setPeerIds] = useState<string[]>([]);
  let length = peerVideos.length;

  for(let i = 0; i < length; i++){
    let stream = peerVideos[i];
    if ( peerIds.includes(stream.peerId) == true ) {
      continue;
    } else {
      peerIds.push(stream.peerId);
      setPeerIds(peerIds);
    }

    const newVideo = document.createElement('video');
    newVideo.srcObject = stream;
    newVideo.setAttribute('class', 'remote-videos' );
    newVideo.setAttribute('id', 'remote-videos-peerid-' + stream.peerId );
   
    newVideo.setAttribute('data-peer-id', stream.peerId);
    if (remoteVideoRef.current) { 
      remoteVideoRef.current.append(newVideo);
      //await newVideo.play().catch(console.error);
      newVideo.play().catch(console.error);
    }
  }

  let memberPeerCount = peerIds.length;
  // videoのサイズ調整
  let sizefix = 1;
  if (memberPeerCount <= 3 && memberPeerCount > 1) {
    sizefix = 2;
  } else if (memberPeerCount > 3) {
    sizefix = 4;
  }
  let videoWidth = 100 / sizefix;

  let rvs: any = document.getElementsByClassName('remote-videos');

  if (rvs.length != 0) {
    for (let item of rvs) {
      //item.style.width = videoWidth + "%";
      item.style.height = videoWidth + "%";
    }
  }

  return (
    <div ref={remoteVideoRef} className={classes.remoteStreams} id="js-remote-streams"></div>
  );
}

export default VideoPlacement;