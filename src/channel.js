/**
 * A simple class used by the chat app to keep track of the users and sockets
 * currently attached to a chat room.
 */
class Channel {
  constructor(id) {
    this.id = id;
    this.users = {};
  }

  /**
   * Get the user and socket bound to "user_id".
   */
  getUser(user_id) {
    if( user_id in this.users ) {
      return this.users[user_id];
    }
    return {user: null, socket_id: null};
  }

  /**
   * Get the user and socket bound to "socket_id".
   */
  getSocketUser(socket_id) {
    for( const [user_id, data] of Object.entries(this.users) ) {
      if( data.socket_id == socket_id ) {
        return data.user;
      }
    }
    return null;
  }
  
  /**
   * Bind the user and their socket bound to "user.id".
   */
  setUser(user, socket) {
    this.users[user.id] = {user: user, socket_id: socket.id}
  }
  
  /**
   * Remove the record binding a user and their socket to "user_id".
   */
  removeUser(user_id) {
    delete this.users[user_id];
  }
}

module.exports.Channel = Channel;
