const Chatroom = require('./Chatroom');
const chatroomTemplates = [
  {
    name: 'TEST1',
    logo: ''
  },
  {
    name: 'TEST2',
    logo: ''
  },
  {
    name: 'TEST3',
    logo: ''
  },
  {
    name: 'TEST4',
    logo: ''
  }
];

module.exports = function() {
  const chatrooms = new Map(chatroomTemplates.map(c => [c.name, Chatroom(c)]));

  function removeClient(client) {
    chatrooms.forEach(c => c.removeUser(client));
  }

  function getChatroomByName(chatroomName) {
    return chatrooms.get(chatroomName);
  }

  function serializeChatrooms() {
    return Array.from(chatrooms.values()).map(c => c.serialize());
  }

  return {
    removeClient,
    getChatroomByName,
    serializeChatrooms
  };
};
