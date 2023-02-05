const sequelize = require('../database/conexion');
const Sequelize = require('sequelize');

const UsersJwt = sequelize.define('users_jwt', {
    user_id: {
        type: Sequelize.BIGINT,
        unique: true
    },
    token_encrypt: {
        type: Sequelize.STRING
    },
    registered_at: {
        type: Sequelize.STRING
    },
    expired_at: {
        type: Sequelize.STRING
    }
}, {timestamps: false, tableName: 'users_jwt'});

module.exports = UsersJwt;