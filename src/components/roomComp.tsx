import React, {Component, useRef, useState} from 'react';
import '../App.css';
import Peer from 'skyway-js';
import FormComp from './FormComp';
import { RouteComponentProps } from 'react-router';

const peer = new Peer({
  key: process.env.REACT_APP_API_KEY!,
  debug: 3
});

let localStream:(MediaStream | undefined) = undefined;

type Props = {} & RouteComponentProps<{roomId: string}>;

const RoomComp: React.FC<Props> = ( props ) => {
  console.log(props.match.params.roomId);
  const [roomId, setRoomId] = useState(props.match.params.roomId);
  const [callId, setCallId] = useState('')

  // useRefは明示的にvideoElmentを指定する
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const connetPeerRef = useRef<HTMLButtonElement>(null);

  const testRef = useRef<HTMLVideoElement>(null);

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
    });


    // Render remote stream for new peer join in the room
    room.on('stream', async stream => {
      const newVideo = document.createElement('video');
      newVideo.srcObject = stream;
      
      newVideo.setAttribute('data-peer-id', stream.peerId);
      if (!remoteVideoRef.current) return; 
      remoteVideoRef.current.append(newVideo);
      await newVideo.play().catch(console.error);
    });
  }

  return (
    <div>
      <div>roomID : {roomId}</div>
      <button ref={connetPeerRef} onClick={connectPeer}>peer on</button>
      <div>
        video
        <video id="my-video" width="400px" ref={videoRef} autoPlay muted playsInline></video>
      </div>
      remote
      <div ref={remoteVideoRef} className="remote-streams" id="js-remote-streams"></div>
    </div>
  );
}

export default RoomComp;