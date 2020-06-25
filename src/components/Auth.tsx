import React, {useState, useEffect, Children} from 'react'
import { Redirect } from 'react-router-dom'
import firebase from '../config/firebase'
import CircularProgress from '@material-ui/core/CircularProgress'
import ReactDOM from 'react-dom'

class Auth extends React.Component {
  state = {
    signinCheck: false, //ログインチェックが完了してるか
    signedIn: false, //ログインしてるか
  }

  _isMounted = false; //unmountを判断（エラー防止用）

  componentDidMount = () => {
    //mountされてる
    this._isMounted = true;

    //ログインしてるかどうかチェック
    firebase.onAuthStateChanged(user => {
        if (user) {
            //してる
            if (this._isMounted) {
                this.setState({
                    signinCheck: true,
                    signedIn: true,
                });
            }
        } else {
            //してない
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
            <CircularProgress />
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