import React from 'react'
import './App.css'
import { BrowserRouter, Route, Switch } from "react-router-dom"
import RoomComp from './components/RoomComp'
import FormComp from './components/FormComp'
import Login from './components/Login'
import NotFound from './404'

import Auth from './components/Auth'


function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login/" component={Login} />
        <Auth>
          <Switch>
            <Route exact path="/create-room/" component={FormComp} />
            <Route exact path="/sfu-room/:roomId" component={RoomComp} />
          </Switch>
        </Auth>
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
