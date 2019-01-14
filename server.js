import express from 'express';
import bodyParser from 'body-parser';
import './utils/dotenv';
import WebSocketServer from './socket/WebSocketServer';
import userController from './routes/users';

const logger = require('./utils/logger')('server');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(`/api/v${process.env.API_VERSION}`, userController);

const server = app.listen(process.env.WS_PORT, 'localhost', () => {
  logger.log(
    'info',
    `App is running at http://localhost:${process.env.WS_PORT} in ${app.get('env')} mode.`,
  );
});

const wss = new WebSocketServer(process.env.WS_PORT, server);
