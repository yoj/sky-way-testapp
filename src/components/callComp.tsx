import React, {Component, useRef, useState, useEffect} from 'react';
import '../App.css';
import Peer from 'skyway-js';

type Props = {
  myStream: MediaStream,
  peer: Peer
}

const CallComp: React.FC<Props> = ( {myStream, peer} ) => {

  console.log("mystreeeem");
  console.log(myStream);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const theirVideoRef = useRef<HTMLVideoElement>(null);

  // 発信処理
  const handleClick = () => {
    let theirID = textAreaRef.current?.value;
    const mediaConnection = peer.call(theirID!, myStream);
    
    mediaConnection.on('stream', stream => {
      // video要素にカメラ映像をセットして再生
      if (!theirVideoRef.current) return
      theirVideoRef.current.srcObject = stream;
      theirVideoRef.current.play();
    });
  }

  // 受信処理
  peer.on('call', mediaConnection => {
    console.log("受信処理 in callComp");
    
    mediaConnection.answer(myStream);
    mediaConnection.on('stream', stream => {
      // video要素にカメラ映像をセットして再生
      if (!theirVideoRef.current) return
      theirVideoRef.current.srcObject = stream;
      theirVideoRef.current.play();
    });
  });

  return (
    <div>
      <div>
        <textarea id="their-id" ref={textAreaRef}></textarea>
        <button id="make-call" onClick={handleClick}>発信</button>
      </div>
      Their Video
      <video id="theire-video" width="400px" ref={theirVideoRef} autoPlay muted playsInline></video>
    </div>
  )
}

export default CallComp;