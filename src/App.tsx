import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import VideoComp from './components/VideoComp';
import RoomComp from './components/RoomComp';
import Login from './components/Login';
import NotFound from './404';

import Auth from './components/Auth'


function App() {

  return (
    <Router>
      <Switch>
        <Auth>
          <Switch>
            <Route exact path="/login/" component={Login} />
            <Route exact path="/1on1-video" component={VideoComp} />
            <Route exact path="/sfu-room/" component={RoomComp} />
          </Switch>
        </Auth>
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
