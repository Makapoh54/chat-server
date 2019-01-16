# chat-server
Websocket chat server

To start server: 
1. Copy .env.template to .env file;
2. run npm i
3. run npm start

Server accepts GET requests on http://localhost:8080/api/v1/users/:username/exists URL, to check user existence before connection to chat;
On user connect/disconnect all network is being notified with new user list;
Each message is broadcasted accross netwrok;
User list is maintained in improvised in memory "storage";