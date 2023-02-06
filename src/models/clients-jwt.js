const sequelize = require("../database/conexion");
const Sequelize = require("sequelize");
const ClientsVip = require("./clients-vip");

const ClientsJwt = sequelize.define(
  "clients_jwt",
  {
    client_id: {
      type: Sequelize.BIGINT,
      unique: true,
    },
    token_encrypt: {
      type: Sequelize.STRING,
    },
    registered_at: {
      type: Sequelize.STRING,
    },
    expired_at: {
      type: Sequelize.STRING,
    },
  },
  { timestamps: false, tableName: "clients_jwt" }
);


module.exports = ClientsJwt;
