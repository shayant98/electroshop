const bcryptjs = require("bcryptjs");

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcryptjs.hashSync("123456", 10), //Sync omdat t seeded data is, for actual regstratian use ASYNC variant
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: bcryptjs.hashSync("123456", 10),
  },
  {
    name: "Shayant",
    email: "shayant@example.com",
    password: bcryptjs.hashSync("123456", 10),
  },
];

module.exports = users;
