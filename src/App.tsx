import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import VideoComp from './components/videoComp';
import RoomComp from './components/roomComp';

function App() {

  return (
    <Router>
      <Switch>
        <Route exact path="/1on1-video" component={VideoComp} />
        <Route exact path="/sfu-room" component={RoomComp} />
      </Switch>
    </Router>
  );
}

export default App;
