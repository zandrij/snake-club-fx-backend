const sequelize = require("../database/conexion");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const ClientsVip = require("./clients-vip");

const Clients = sequelize.define('Clients', {
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

Clients.hasOne(ClientsVip, {foreignKey: 'client_id'})

module.exports = Clients;