import React, {Component, useRef, useState} from 'react';
import '../App.css';
import { prependOnceListener } from 'cluster';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import MeetingRoomOutlinedIcon from '@material-ui/icons/MeetingRoomOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

/*** CSS ***/
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
/***********/

type Props = {}

const FormComp: React.FC<Props> = ( props: any ) => {

  const classes = useStyles();

  const [roomId, setRoomId] = useState('');

  const handlerTest = () => {
      console.log(roomId);
      props.history.push("/sfu-room/" + roomId);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <MeetingRoomOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create Room
        </Typography>

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="RoomID"
          name="roomId"
          autoFocus
          value={roomId}
          onChange={e => setRoomId(e.target.value)} 
        />
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handlerTest}
        >
            Create
          </Button>
      </div>
    </Container>
  );
}

export default FormComp;