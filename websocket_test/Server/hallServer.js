const {
  HALL_SOCKET_CONF,
  GAME_SOCKET_CONF
} = require('./socket_conf')
const loadsh = require('loadsh');
//websocket服务
var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({
    host: HALL_SOCKET_CONF.host,
    port: HALL_SOCKET_CONF.port
  });
console.log("启动大厅服");
wss.on('connection', function (ws) {
  console.log('client connected');
  ws.on('message', (message) => {
    console.log(message);
    let data = JSON.parse(message);
    if (data.msghead == "lobbyToGame") {
      data.msgdata = {};
      data.msgdata['host'] = GAME_SOCKET_CONF.host;
      data.msgdata['port'] = GAME_SOCKET_CONF.port;
      data.msgdata = JSON.stringify(data.msgdata);
    }
    ws.send(JSON.stringify(data));
  });
  ws.on('close', (code, reason) => {
    console.log('socket close', code, reason)
  });
  ws.on('error', (err) => {
    console.log('socket err', err);
  })
});

// //http服务
// const http = require('http')
// const PORT = 8000;
// const server = http.createServer((req, res) => {
//   //设置返回格式
//   res.setHeader('Content-type', 'application/json');
//   const url = req.url;

//   console.log(url);
//   res.end(JSON.stringify({msg:"哈哈哈哈"}))

// });
// server.listen(PORT);