var http = require('http').createServer();
var io = require('socket.io')(http);

// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/index.html');
// });

const ClientManager = require('./ClientManager');
const ChatroomManager = require('./ChatroomManager');
const makeHandlers = require('./handlers');

const clientManager = ClientManager();
const chatroomManager = ChatroomManager();

io.on('connection', function(client) {
  const {
    handleRegister,
    handleUnregister,
    handleJoin,
    handleLeave,
    handleMessage,
    handleGetChatrooms,
    handleDisconnect
  } = makeHandlers(client, clientManager, chatroomManager);

  console.log('client connected...', client.id);
  clientManager.addClient(client);

  client.on('register', handleRegister);

  client.on('unregister', handleUnregister);

  client.on('join', handleJoin);

  client.on('leave', handleLeave);

  client.on('message', handleMessage);

  client.on('chatrooms', handleGetChatrooms);

  client.on('disconnect', function() {
    console.log('client disconnect...', client.id);
    handleDisconnect();
  });

  client.on('error', function(err) {
    console.log('received error from client:', client.id);
    console.log(err);
  });
});

http.listen(3000, function(err) {
  if (err) throw err;
  console.log('listening on port 3000');
});
