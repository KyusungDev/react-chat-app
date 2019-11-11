import io from 'socket.io-client';
const socket = io.connect('http://localhost:3000');

socket.on('error', function(err: any) {
  console.log('received socket error:');
  console.log(err);
});

socket.on('connect', (socket: any) => {
  console.log('connetecd', socket);
});

function onMessage(receiver: Function) {
  socket.on('message', receiver);
}

function discardMessage() {
  socket.off('message');
}

function register(name: string, cb: any) {
  socket.emit('register', name, cb);
}

function unregister(cb: any) {
  socket.emit('unregister', cb);
}

function join(chatroomName: string, cb: Function) {
  socket.emit('join', chatroomName, cb);
}

function leave(chatroomName: string, cb: Function) {
  socket.emit('leave', chatroomName, cb);
}

function message(chatroomName: string, msg: string, cb: Function) {
  socket.emit('message', { chatroomName, message: msg }, cb);
}

function getChatrooms(cb: Function) {
  socket.emit('chatrooms', null, cb);
}

export default {
  register,
  unregister,
  join,
  leave,
  message,
  getChatrooms,
  onMessage,
  discardMessage
};
