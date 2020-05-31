import React, {Component, useRef, useEffect, useState} from 'react';
import '../App.css';
import Peer from 'skyway-js';

type Props = {
  peer: Peer
};

const VideoComp: React.FC<Props> = ( {peer} ) => { 
  // useRefは明示的にvideoElmentを指定する
  const videoRef = useRef<HTMLVideoElement>(null);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const theirVideoRef = useRef<HTMLVideoElement>(null);

  const [myId, setMyId] = useState('');

  //const [localStream, setLoacalStream] = useState<MediaStream | undefined>(undefined);
  let localStream:(MediaStream | undefined) = undefined;

  // useEffectで後から処理になるはず
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then( stream => {
        // 成功時にvideo要素にカメラ映像をセットし、再生
        if (!videoRef.current) return
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        // 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
        //localStream = stream;
        console.log("localStreamTmp is ++++++++++++");
        localStream = stream;
        console.log(localStream);
        
    }).catch( error => {
        // 失敗時にはエラーログを出力
        console.error('mediaDevice.getUserMedia() error:', error);
        return;
    });
  });

  peer.on('open', () => {
    setMyId(peer.id);
  });

  // 発信処理
  const handleClick = () => {
    let theirID = textAreaRef.current?.value;
    const mediaConnection = peer.call(theirID!, localStream);
    
    mediaConnection.on('stream', stream => {
      // video要素にカメラ映像をセットして再生
      if (!theirVideoRef.current) return
      theirVideoRef.current.srcObject = stream;
      theirVideoRef.current.play();
    });
  }

  // 受信処理
  peer.on('call', mediaConnection => {
    console.log("受信処理1111111111111");
    mediaConnection.answer(localStream);
    console.log("受信処理2222222222222");
    mediaConnection.on('stream', stream => {
      // video要素にカメラ映像をセットして再生
      if (!theirVideoRef.current) return
      console.log("受信処理333333333333333");
      theirVideoRef.current.srcObject = stream;
      console.log("受信処理4444444444444444");
      theirVideoRef.current.play();
    });
  });

  // エラー処理
  peer.on('error', err => {
    alert(err.message);
  });

  return (
    <div>
      <div>MyID : {myId}</div>
      <div>
        video
        <video id="my-video" width="400px" ref={videoRef} autoPlay muted playsInline></video>
      </div>
      <div>
        <textarea id="their-id" ref={textAreaRef}></textarea>
        <button id="make-call" onClick={handleClick}>発信</button>
      </div>
      <div>
        Their Video
        <video id="theire-video" width="400px" ref={theirVideoRef} autoPlay muted playsInline></video>
      </div>
    </div>
  );
}

export default VideoComp;