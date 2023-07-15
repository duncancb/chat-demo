class Channel {
  constructor() {
    
  }

  join() {
    return new Promise((resolve) => {
      for (let i = 0; i < this.roomsState.length; i++) {
        if (this.roomsState[i].users < ROOM_MAX_CAPACITY) {
          this.roomsState[i].users++;
          return resolve(this.roomsState[i].id);
        }
      }

      const newID = uuidv4();
      this.roomsState.push({
        id: newID,
        users: 1,
      });
      return resolve(newID);
    });
  }

  leave(id) {
    this.roomsState = this.roomsState.filter((room) => {
      if (room.id === id) {
        if (room.users === 1) {
          return false;
        } else {
          room.users--;
        }
      }
      return true;
    });
  }
}

module.exports = Room;
