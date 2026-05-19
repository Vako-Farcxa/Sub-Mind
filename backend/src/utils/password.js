const bcrypt = require("bcryptjs");

const HASH_ROUNDS = 12;

const hashPassword = (password) => bcrypt.hash(password, HASH_ROUNDS);

const comparePassword = (password, passwordHash) => bcrypt.compare(password, passwordHash);

module.exports = {
  comparePassword,
  hashPassword,
};
