import React from 'react';
import logo from './WS-ON-PREM-top-header.drawio.png';
import './App.css';
import Messages from "./component/Messages";
import { Typography } from "@mui/material";
import { uuidv4 } from './util/uuid';

function App() {
  const analystID = uuidv4();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="Iteris no TDC" />
      </header>
      <div>
        <Typography variant="h1">Olá, Analista-{analystID}!</Typography>
        <Messages />
      </div>
    </div>
  );
}

export default App;
