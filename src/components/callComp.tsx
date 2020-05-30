import React, {Component, useRef, useState, useEffect} from 'react';
import '../App.css';
import Peer from 'skyway-js';

type Props = {
  myStream: MediaStream,
  peer: Peer
}

/*
const peer = new Peer({
  key: 'acbe9e88-dfd6-495a-8ab3-8aae221fe08e',
  debug: 3
});
*/

const CallComp: React.FC<Props> = ( {myStream, peer} ) => {

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
    console.log(mediaConnection);
  });

  return (
    <div>
      <div>
        <textarea id="their-id" ref={textAreaRef}></textarea>
        <button id="make-call" onClick={handleClick}>発信</button>
      </div>
      <video ref={theirVideoRef}></video>
    </div>
  )
}

export default CallComp;