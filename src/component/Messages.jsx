import React, { useEffect, useState} from "react";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";
import BlenderIcon from "@mui/icons-material/Blender";
import AccessAlarms from "@mui/icons-material/AccessAlarms";
import Store from "@mui/icons-material/Store";
import { uuidv4 } from "../util/uuid";

function getProductInfo(wsMessage) {
    if (wsMessage) {
      return JSON.parse(JSON.parse(JSON.parse(wsMessage.data).data).product);
      //return `Product ID: ${product.productId};Product value: ${product.value}`
    }
    else {
      return '';
    }
}

function getStatus(message) {
  return message.status ? ' - ' + message.status : '';
}

export default function Messages() {
  const socketUrl = 'wss://0slffnr167.execute-api.sa-east-1.amazonaws.com/prd';
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      const product = getProductInfo(lastMessage);
      setMessageHistory((prev) => prev.filter((productItem) => productItem.productId !== product.productId).concat(product));
    }
  }, [lastMessage, setMessageHistory]);

  // useEffect(() => {
  //   if (lastMessage !== null) {
  //     const product = getProductInfo(lastMessage);
  //     const newMessageHistory = messageHistory.filter((productItem) => productItem.productId !== product.productId);
  //     newMessageHistory.concat(product);
  //     setMessageHistory(newMessageHistory);
  //   }
  // }, [lastMessage, setMessageHistory]);

  const handleClickSendMessage = () => {
      const divida = {
        "product": JSON.stringify({
          productId: uuidv4(),
          value: Math.random() * 100
        })
      };
      sendMessage(JSON.stringify(divida));
    };

  const handleClickProcessOrder = () => {
    const products = messageHistory.filter((productItem) => productItem.status !== 'Processado');

    if (products) {
      const compra = {
        "product": JSON.stringify({
          productId: products[0].productId,
          value: products[0].value,
          status: 'Processado'
        })
      };
      sendMessage(JSON.stringify(compra));
    }
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>
      <div>
        <fieldset>
          <legend>dívidas</legend>
          <Button
            onClick={handleClickSendMessage}
            disabled={readyState !== ReadyState.OPEN}
            fullWidth={true}
            startIcon={<AccessAlarms />}
          >
            Simular nova compra
          </Button>

          <Button
            onClick={handleClickProcessOrder}
            disabled={readyState !== ReadyState.OPEN}
            fullWidth={true}
            startIcon={<BlenderIcon />}
          >
            Processar última compra
          </Button>

          <span>
            WebSocket está <strong>{connectionStatus}</strong>
          </span>

          <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
              {
                lastMessage ? <span>última ordem recebida: {lastMessage.data}</span> : null
              }
            </Typography>
            <List dense={true}>
              {
                messageHistory.map((message, idx) => (
                  <ListItem key={idx}>
                    <ListItemAvatar>
                      <Avatar>
                        <Store />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={`ID: ${message.productId}`}
                      secondary={`Value: ${message.value}` + getStatus(message)}
                    />

                  </ListItem>
                ))
              }
            </List>
          </Box>
        </fieldset>
      </div>
    </div>
  );
}