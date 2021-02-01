module.exports = {
  rethinkdb: {
    host: 'localhost',
    port: 28015,
    username: 'admin',
    password: '',
    // authKey: "",
    db: 'maya',
  },
  express: {
    port: 4000,
  },
  cors: {
    origin: 'http://localhost:8081',
  },
};
