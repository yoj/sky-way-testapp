import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import VideoComp from './components/VideoComp';
import RoomComp from './components/RoomComp';
import FormComp from './components/FormComp';
import Login from './components/Login';
import NotFound from './404';


function App() {

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/1on1-video" component={VideoComp} />
        <Route exact path="/sfu-room/create-room" component={FormComp} /> 
        <Route exact path="/sfu-room/" component={RoomComp} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
