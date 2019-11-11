module.exports = function() {
  const clients = new Map();

  function addClient(client) {
    clients.set(client.id, { client });
  }

  function registerClient(client, user) {
    clients.set(client.id, { client, user });
  }

  function unregisterClient(client) {
    clients.set(client.id, { client });
  }

  function removeClient(client) {
    clients.delete(client.id);
  }

  function getTakenUsers() {
    const takenUsers = Array.from(clients.values())
      .filter(c => c.user)
      .map(c => c.user.name);

    return takenUsers;
  }

  function isUserAvailable(userName) {
    return !getTakenUsers().includes(userName);
  }

  function getUserByClientId(clientId) {
    return (clients.get(clientId) || {}).user;
  }

  return {
    addClient,
    registerClient,
    unregisterClient,
    removeClient,
    isUserAvailable,
    getUserByClientId
  };
};
