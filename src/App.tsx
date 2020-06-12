import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import VideoComp from './components/VideoComp';
import RoomComp from './components/RoomComp';
import InputComp from './components/FormComp';


function App() {

  return (
    <Router>
      <Switch>
        <Route exact path="/1on1-video" component={VideoComp} />
        <Route exact path="/sfu-room/create-room" component={InputComp} />
        <Route exact path="/sfu-room/:roomId" component={RoomComp} />
      </Switch>
    </Router>
  );
}

export default App;
