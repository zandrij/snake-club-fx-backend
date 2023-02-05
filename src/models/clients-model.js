const sequelize = require("../database/conexion");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

const Clients = sequelize.define('clients', {
    name: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    country: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING,
    },
    state: {
        type: Sequelize.TINYINT,
    },
}, {timestamps: false, tableName: 'clients'});


// Antes de guardar un usuario, cifra su contraseña
Clients.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, 10).then((hash) => {
      user.password = hash;
    });
});

module.exports = Clients;