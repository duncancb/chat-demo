class Channel {
  constructor(id) {
    this.id = id;
    this.users = {};
  }

  getUser(user_id) {
    if( user_id in this.users ) {
      return this.users[user_id];
    }
    return {user: null, socket_id: null};
  }

  getSocketUser(socket_id) {
    for( const [user_id, data] of Object.entries(this.users) ) {
      if( data.socket_id == socket_id ) {
        return data.user;
      }
    }
    return null;
  }
  
  setUser(user, socket) {
    this.users[user.id] = {user: user, socket_id: socket.id}
  }
  
  removeUser(user_id) {
    delete this.users[user_id];
  }
}

module.exports.Channel = Channel;
