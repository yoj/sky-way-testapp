import React, {Component, useRef, useState} from 'react';
import '../App.css';
import { prependOnceListener } from 'cluster';

type Props = {}

const FormComp: React.FC<Props> = ( props: any ) => {
  const [roomId, setRoomId] = useState('');

  const handlerTest = () => {
      console.log(roomId);
      props.history.push("/sfu-room/" + roomId);
  }

  return (
    <div>
        <input type="text" value={roomId} onChange={e => setRoomId(e.target.value)}  />
        <button id="make-call" onClick={handlerTest}>SetRoomId</button>
    </div>
  );
}

export default FormComp;