import React, {useState, useEffect, Children} from 'react'
import '../App.css'
import { Redirect } from 'react-router-dom'
import firebase from '../config/firebase'
import CircularProgress from '@material-ui/core/CircularProgress'
import LinearProgress from '@material-ui/core/LinearProgress'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'


class Auth extends React.Component {
  state = {
    signinCheck: false,
    signedIn: false,
  }

  _isMounted = false;

  componentDidMount = () => {
    this._isMounted = true;
    firebase.onAuthStateChanged(user => {
      if (user) {
        if (this._isMounted) {
          this.setState({
            signinCheck: true,
            signedIn: true,
          });
        }
      } else {
        if (this._isMounted) {
          this.setState({
            signinCheck: true,
            signedIn: false,
          });
        }
      }
    })
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  }

  render() {
    //チェックが終わってないなら（ローディング表示）
    if (!this.state.signinCheck) {
      return (
        <div className="loading">
          <LinearProgress />
        </div>
      );
    }
    //チェックが終わりかつ
    if (this.state.signedIn) {
      //サインインしてるとき（そのまま表示）
      return this.props.children;
    } else {
      //してないとき（ログイン画面にリダイレクト）
      return <Redirect to="/login" />
    }
  }
}

export default Auth;