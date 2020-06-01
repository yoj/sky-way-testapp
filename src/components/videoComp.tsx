import React, {Component, useRef, useState} from 'react';
import '../App.css';
import Peer from 'skyway-js';

type Props = {
};

const peer = new Peer({
  key: '',
  debug: 3
});

let localStream:(MediaStream | undefined) = undefined;

const VideoComp: React.FC<Props> = ( {} ) => {
  const [myId, setMyId] = useState('');
  const [callId, setCallId] = useState('')

  // useRefは明示的にvideoElmentを指定する
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then( strem => {
      if (!videoRef.current) return;
      videoRef.current.srcObject = strem;
      localStream = strem;
    })
    .catch( e => { console.log(e);});

  // PeerID 発番
  peer.on('open', () => {
    setMyId(peer.id);
  });

  // 発信処理
  const handleClick = () => {
    const mediaConnection = peer.call(callId, localStream!);
    
    mediaConnection.on('stream', async stream => {
      // video要素にカメラ映像をセットして再生
      if (!remoteVideoRef.current) return
      remoteVideoRef.current.srcObject = stream;
      await remoteVideoRef.current.play();
    });
  }
  // 受信処理
  peer.on('call', mediaConnection => {
    mediaConnection.answer(localStream);

    mediaConnection.on('stream', async stream => {
      if (!remoteVideoRef.current) return
      remoteVideoRef.current.srcObject = stream;
      //await remoteVideoRef.current.play();
    });
  });

  return (
    <div>
      <div>MyID : {myId}</div>
      <div>
        video
        <video id="my-video" width="400px" ref={videoRef} autoPlay muted playsInline></video>
      </div>
      <div>
      <input value={callId} onChange={e => setCallId(e.target.value)}></input>
        <button id="make-call" onClick={handleClick}>発信</button>
      </div>
      <div>
        Their Video
        <video id="remote-video" width="400px" ref={remoteVideoRef} autoPlay muted playsInline></video>
      </div>
    </div>
  );
}

export default VideoComp;