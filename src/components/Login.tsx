import React, {Fragment, useEffect, useState} from 'react';
import {
  Button,
  Container,
  FormControl,
  Grid,
  Link,
  TextField,
  Typography
} from "@material-ui/core";

import auth from '../config/firebase'

type Props = {}

const Signup:React.FC<Props> = (props: any) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      user && props.history.push("/sfu-room/create-room");
    });
  }, []);

  // login 
  const login = async () => {
    console.log("login event");
    await auth.signInWithEmailAndPassword(email, password)
      .then(result => {
        props.history.push("/sfu-room/create-room");
      })
      .catch(e => {
        alert("メールアドレスまたはパスワードが間違っています。");
      })
  }

  return (
    <Fragment>
      <Container>
        <Grid container>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            login form
            <FormControl margin="normal" fullWidth>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="email"
                name="email"
                autoFocus
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(event.target.value);
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="password"
                label="password"
                name="password"
                value={password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(event.target.value);
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={login}
                style={{ marginTop: "0.5em", marginBottom: "0.5em" }}
              >
                Login
              </Button>
            </FormControl>
          </Grid>
          <Grid item md={4}></Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default Signup;