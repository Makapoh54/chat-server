import WebSocket from 'ws';
import messageTypes from './messageTypes';

const logger = require('../utils/logger')('WebSocketServer');

export default class WebSocketServer {
  constructor(port) {
    this.users = [];
    this.wss = new WebSocket.Server({ port });

    this.wss.on('connection', ws => {
      ws.on('message', message => this.handleMessage(message, ws));
      ws.on('close', () => {
        this.users.splice(this.users.length, 1);
        this.broadcast({ type: 'USERS_LIST', users: this.users }, ws);
      });
    });
  }

  broadcast(message, ws, exceptClient = true) {
    this.wss.clients.forEach(client => {
      if ((!exceptClient || client !== ws) && client.readyState === WebSocket.OPEN) {
        logger.log('debug', `Broadcast: ${message}`);
        client.send(JSON.stringify(message));
      }
    });
  }

  handleMessage(message, ws) {
    const data = JSON.parse(message);
    switch (data.type) {
      case messageTypes.ADD_USER: {
        logger.log('info', `User: ${data.name} connected!`);
        this.users.push({ name: data.name, id: this.users.length + 1 });
        this.broadcast(
          {
            type: messageTypes.USERS_LIST,
            users: this.users,
          },
          ws,
        );
        logger.log('debug', `User List: ${this.users}`);
        break;
      }
      case messageTypes.ADD_MESSAGE:
        this.broadcast(
          {
            type: messageTypes.ADD_MESSAGE,
            message: data.message,
            author: data.author,
          },
          ws,
          false,
        );
        logger.log('debug', `ADD_MESSAGE called, data: ${data}`);
        break;
      default:
        break;
    }
  }
}
