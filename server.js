import './utils/dotenv';
import WebSocketServer from './socket/WebSocketServer';

const logger = require('./utils/logger')('server');

const wss = new WebSocketServer(process.env.WS_PORT);
logger.log('info', `WS server started on port ${wss.port}`);
