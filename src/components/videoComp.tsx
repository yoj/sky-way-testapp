import React, {Component, useRef, useEffect, useState} from 'react';
import '../App.css';
import CallComp from './callComp';
import Peer from 'skyway-js';

type Props = {
  peer: Peer
};

const VideoComp: React.FC<Props> = ( {peer} ) => { 
  // useRefは明示的にvideoElmentを指定する
  const videoRef = useRef<HTMLVideoElement>(null);

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
          localStream = stream;
      }).catch( error => {
          // 失敗時にはエラーログを出力
          console.error('mediaDevice.getUserMedia() error:', error);
          return;
      });
  });

  return (
      <div>
        <div>
          video
          <video id="my-video" width="400px" ref={videoRef} autoPlay muted playsInline></video>
        </div>
        <div>
          CallPart
          <CallComp myStream={localStream!} peer={peer} />
        </div>
      </div>
  );
}

export default VideoComp;