import React, {Component, useRef, useState, useEffect} from 'react';
import '../App.css';
import Peer from 'skyway-js';

type Props = {
  peer: Peer
}

const PeerComp: React.FC<Props> = ( {peer} ) => {

  const [myId, setMyId] = useState('');

  useEffect(() => {
    // PeerIDの取得
    peer.on('open', () => {
      setMyId(peer.id);
    });
  });

  return (
   <div>{myId}</div>
  )
}

export default PeerComp;