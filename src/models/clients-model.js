const sequelize = require("../database/conexion");
const Sequelize = require("sequelize");

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
    vip: {
        type: Sequelize.TINYINT,
        allowNull: true
    },
    payment_date: {
        type: Sequelize.STRING,
        allowNull: true
    },
    payment_state: {
        type: Sequelize.TINYINT,
        allowNull: true
    }
});

module.exports = Clients;