import React from 'react';
import logo from './logo.svg';
import './App.css';
import Peer from 'skyway-js';
import VideoComp from './components/videoComp';
import PeerComp from './components/peerComp';

type Stream = {
  localStream: MediaStream;
}

const peer = new Peer({
  key: 'acbe9e88-dfd6-495a-8ab3-8aae221fe08e',
  debug: 3
});

function App() {

  return (
    <div className="App">
      video
      <VideoComp peer={peer}/>
      peerID
      <PeerComp peer={peer} />
    </div>
  );
}

export default App;
