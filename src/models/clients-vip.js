const sequelize = require("../database/conexion");
const Sequelize = require("sequelize");

const ClientsVip = sequelize.define("Vip", {
    client_id: {
      type: Sequelize.BIGINT,
      unique: true,
    },
    state: {
      type: Sequelize.TINYINT,
    },
    payment_state: {
      type: Sequelize.TINYINT,
    },
    payment_date: {
      type: Sequelize.STRING,
    },
  },
  { timestamps: false, tableName: "clients_vip" }
);

module.exports = ClientsVip;
