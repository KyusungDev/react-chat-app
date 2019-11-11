function makeHandleEvent(client, clientManager, chatroomManager) {
  function ensureExists(getter, rejectionMessage) {
    return new Promise(function(resolve, reject) {
      const res = getter();
      return res ? resolve(res) : reject(rejectionMessage);
    });
  }

  function ensureUserSelected(clientId) {
    return ensureExists(
      () => clientManager.getUserByClientId(clientId),
      'invalid username'
    );
  }

  function ensureValidChatroom(chatroomName) {
    return ensureExists(
      () => chatroomManager.getChatroomByName(chatroomName),
      `invalid chatroom name: ${chatroomName}`
    );
  }

  function ensureValidChatroomAndUserSelected(chatroomName) {
    return Promise.all([
      ensureValidChatroom(chatroomName),
      ensureUserSelected(client.id)
    ]).then(([chatroom, user]) => Promise.resolve({ chatroom, user }));
  }

  function handleEvent(chatroomName, createEntry) {
    return ensureValidChatroomAndUserSelected(chatroomName).then(function({
      chatroom,
      user
    }) {
      const entry = { user, ...createEntry() };
      chatroom.addEntry(entry);
      chatroom.broadcastMessage({ chat: chatroomName, ...entry });
      return chatroom;
    });
  }

  return handleEvent;
}

module.exports = function(client, clientManager, chatroomManager) {
  const handleEvent = makeHandleEvent(client, clientManager, chatroomManager);

  function handleRegister(userName, callback) {
    if (!clientManager.isUserAvailable(userName))
      return callback('user is not available');

    const user = { name: userName };
    clientManager.registerClient(client, user);

    return callback(null, user);
  }

  function handleUnregister(callback) {
    clientManager.unregisterClient(client);
    return callback(null);
  }

  function handleJoin(chatroomName, callback) {
    const createEntry = () => ({ event: `joined ${chatroomName}` });

    handleEvent(chatroomName, createEntry)
      .then(function(chatroom) {
        chatroom.addUser(client);
        callback(null, chatroom.getChatHistory());
      })
      .catch(callback);
  }

  function handleLeave(chatroomName, callback) {
    const createEntry = () => ({ event: `left ${chatroomName}` });

    handleEvent(chatroomName, createEntry)
      .then(function(chatroom) {
        chatroom.removeUser(client.id);

        callback(null);
      })
      .catch(callback);
  }

  function handleMessage({ chatroomName, message } = {}, callback) {
    const createEntry = () => ({ message });

    handleEvent(chatroomName, createEntry)
      .then(() => callback(null))
      .catch(callback);
  }

  function handleGetChatrooms(_, callback) {
    return callback(null, chatroomManager.serializeChatrooms());
  }

  function handleDisconnect() {
    clientManager.removeClient(client);
    chatroomManager.removeClient(client);
  }

  return {
    handleRegister,
    handleUnregister,
    handleJoin,
    handleLeave,
    handleMessage,
    handleGetChatrooms,
    handleDisconnect
  };
};
