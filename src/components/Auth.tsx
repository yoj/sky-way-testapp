import React, {useState, useEffect, Children} from 'react'
import { Redirect } from 'react-router-dom'
import firebase from '../config/firebase'
import CircularProgress from '@material-ui/core/CircularProgress'
import ReactDOM from 'react-dom'

type Props = {}
const Auth: React.FC<Props> = (props) => {
  const [signinCheck, setSigninCheck] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  //const [fbUser, setFbUser] = useState<firebase.User|null>(null)
  let fbUser: (firebase.User|null) = null

  let isMounted = false

  console.log(Children)
  useEffect(() => {
    //isMounted = true
    console.log("useEffect")
    firebase.onAuthStateChanged(user=> {
      if (user) {
        // ログイン済
        if (isMounted) {
          /*let status = true
          setSigninCheck(status)
          setSignedIn(status)*/

          console.log(user)
          fbUser = user
        }
      } else {
        // 未ログイン
        let status = false
        setSigninCheck(status)
        status = true
        setSignedIn(status)
      }
    })
    // componentWillUnmountの代替
    return () => {
      console.log("unmaout")
      isMounted = false
    }
  })

  // ログインチェックが終わっていなかった場合
  //if (!signinCheck) {
    return (
      <>
      {(() => {
        console.log(props.children)
        if (!isMounted) {
          console.log("その1")
          return <CircularProgress />
        }

        if (fbUser != null) {
          console.log("その2")
          return props.children
        } else {
          console.log("その3")
          return <Redirect to="/login/" />
        }
      })()}
      </>
    )
  //}
  // ログインチェックが終わっていた場合
  /*if (signedIn) {
    console.log("sfuroomにリダイレクトするはず");
    return (
      <Redirect to="/sfu-room" />
    )
  } else {
    return (
      <Redirect to="/login/" />
    )
  }*/
}

export default Auth