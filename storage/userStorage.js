// Simple object storage for users

const users = [];

class UserStorage {
  constructor() {
    this.users = [];
  }

  isUserExist(username) {
    return this.users.some(user => user.username === username);
  }

  addUser(username) {
    if (!this.isUserExist(username)) this.users.push({ username, id: users.length + 1 });
    return { username, id: users.length + 1 };
  }

  removeUser(id) {
    if (id >= 0 && id <= this.users.length) this.users.splice(id, 1);
    return this.users;
  }

  getAllUsers() {
    return this.users;
  }

  getLastUser() {
    return this.users[this.users.length - 1];
  }
}

const storage = new UserStorage();

export default storage;
