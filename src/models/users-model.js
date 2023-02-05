const sequelize = require("../database/conexion");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "users",
  {
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
  },
  { timestamps: false }
);

// Antes de guardar un usuario, cifra su contraseña
User.beforeCreate((user, options) => {
  return bcrypt.hash(user.password, 10).then((hash) => {
    user.password = hash;
  });
});

module.exports = User;
