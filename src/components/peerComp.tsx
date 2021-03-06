import React, {useState} from 'react';
import '../App.css';
import Peer from 'skyway-js';

type Props = {
  peer: Peer
}

const PeerComp: React.FC<Props> = ( {peer} ) => {

  const [myId, setMyId] = useState('');

  peer.on('open', () => {
    setMyId(peer.id);
  });

  return (
   <div>{myId}</div>
  )
}

export default PeerComp;