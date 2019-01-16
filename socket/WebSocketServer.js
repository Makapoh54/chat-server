import WebSocket from 'ws';
import messageTypes from './messageTypes';
import userStorage from '../storage/userStorage';

const logger = require('../utils/logger')('WebSocketServer');

export default class WebSocketServer {
  constructor(port, server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on('connection', ws => {
      ws.on('message', message => this.handleMessage(message, ws));
      ws.on('close', () => {
        logger.log('info', `User disconnected!`);
        if (ws.user && ws.user.id) userStorage.removeUser(ws.user.id);
        this.broadcast({ type: 'USERS_LIST', users: userStorage.getAllUsers() }, ws);
      });
    });
  }

  broadcast(message, ws, exceptClient = false) {
    this.wss.clients.forEach(client => {
      if ((!exceptClient || client !== ws) && client.readyState === WebSocket.OPEN) {
        logger.log('debug', `Broadcast: ${JSON.stringify(message)}`);
        client.send(JSON.stringify(message));
      }
    });
  }

  handleMessage(message, ws) {
    logger.log('info', `message: ${message}!`);
    const data = JSON.parse(message);
    switch (data.type) {
      case messageTypes.ADD_USER: {
        logger.log('info', `User: ${data.username} connected!`);
        ws.user = userStorage.addUser(data.username);
        this.broadcast(
          {
            type: messageTypes.USERS_LIST,
            users: userStorage.getAllUsers(),
          },
          ws,
        );
        break;
      }
      case messageTypes.ADD_MESSAGE:
        this.broadcast(
          {
            type: messageTypes.ADD_MESSAGE,
            message: data.message,
            username: data.username,
          },
          ws,
          true,
        );
        logger.log('debug', `ADD_MESSAGE called, data: ${JSON.stringify(data)}`);
        break;
      default:
        break;
    }
  }
}
