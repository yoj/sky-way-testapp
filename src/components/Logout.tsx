import React, {Fragment, useEffect, useState} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import auth from '../config/firebase'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

type Props = {}

const Signout:React.FC<Props> = (props: any) => {
  const classes = useStyles();

  // login 
  /*
  const login = async () => {
    await auth.signInWithEmailAndPassword(email, password)
      .then(result => {
        props.history.push("/sfu-room/");
      })
      .catch(e => {
        alert("メールアドレスまたはパスワードが間違っています。");
      })
  }
  */
  const logout = async () => {
    await auth.onAuthStateChanged( (user) => {
      auth.signOut().then( () => {

      })
      .catch( (error) => {
        alert('ログインアウトに失敗しました')
      })
    })
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Signout;