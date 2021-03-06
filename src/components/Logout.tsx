import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

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