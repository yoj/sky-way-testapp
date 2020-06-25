import React, {useState, useEffect} from 'react'
import { Redirect } from 'react-router-dom'
import firebase from '../config/firebase'
import CircularProgress from '@material-ui/core/CircularProgress'

type Props = {}
const Auth: React.FC<Props> = (props) => {
  const [signinCheck, setSigninCheck] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  let isMounted = false

  useEffect(() => {
    isMounted = true

    firebase.onAuthStateChanged(user=> {
      if (user) {
        // ログイン済
        if (isMounted) {
          setSigninCheck(true)
          setSignedIn(true)
        }
      } else {
        // 未ログイン
        setSigninCheck(true)
        setSignedIn(false)
      }
    })
    // componentWillUnmountの代替
    return () => {
      isMounted = false
    }
  })

  // ログインチェックが終わっていなかった場合
  if (!signinCheck) {
    return (
      <CircularProgress />
    )
  }

  // ログインチェックが終わっていた場合
  if (signedIn) {
    return (
      <>
        {props.children}
      </>
    )
  } else {
    return (
      <div>ケース3</div>
    )
  }
}

export default Auth