const {
  GAME_SOCKET_CONF
} =  require('./socket_conf')
//websocket服务
var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({
    host: GAME_SOCKET_CONF.host,
    port: GAME_SOCKET_CONF.port
  });
  console.log("启动游戏服");
wss.on('connection', function (ws) {
  console.log('client connected');
  ws.on('message', (message) => {
    console.log(message);
    ws.send(message);
  });
  ws.on('close', (code, reason) => {
    console.log('socket close', code, reason)
  });
  ws.on('error', (err) => {
    console.log('socket err', err);
  })
});