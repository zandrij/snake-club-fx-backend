const { validationResult } = require("express-validator");
const Clients = require("../../models/clients-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ClientsJwt = require("../../models/clients-jwt");
const dayjs = require("dayjs");
const { validSession } = require("../utils/utils");
dayjs.locale("es_ES");

// * USER FUNCTIONS

// client register
const storeClient = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, email, country, password } = req.body;

    Clients.create({
      name,
      email,
      country,
      password,
      state: true,
    })
    .then((user) => {
      let userRegistered = user.get({ plain: true });
      delete userRegistered["password"];
      delete userRegistered["state"];
      return res.send({ ok: "success" });
    })
    .catch((err) => {
      if (err.parent.errno === 1062) return res.send({ error: "register duplicate" });
      return res.send({ error: "imposible" });
    });
  } catch (error) {
    return res.send({ error: "error" }, 404);
  }
};

// client information update
const updateClient = async (req, res) => {
  const { decoded } = await validSession(req, res);
  if ( Object.keys(decoded).length > 0 ){

    const { name, email, country } = req.body

    Clients.findOne({ where: { id: decoded.id }, attributes: { exclude: 'password'}})
    .then( user => {
      if( user.email === email){
        Clients.update({ name, email, country }, { where: { id: decoded.id }})
        .then( () => {
          res.send({ ok: 'ok' });
          return;
        })
        .catch( () => {
          res.send({ error: "error" }, 404);
        })
      }else{
        Clients.update({ name, email, country }, { where: { id: decoded.id }})
        .then( () => {
          res.send({ ok: 'ok' });
          return;
        })
        .catch( (err) => {
          if (err.parent.errno === 1062) return res.send({ error: "email existing" });
          res.send({ error: "error" }, 404);
          return;
        });
      }
    })
    .catch(err => {
      return res.send({ error: err }, 404);
    })
  }
};

// client login
const loginClient = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    Clients.findOne({ where: {email: email}})
    .then((user) => {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (err) return res.status(400).json({ errors: "imposible" });

        if (result) {
          await createTokenUser(user.dataValues, res);
        } else {
          return res.status(400).json({ errors: "incorrect password" });
        }
      });
    })
    .catch(() => {
      return res.status(400).json({ errors: "user no register" });
    });
  } catch (error) {
    return res.status(400).json({ errors: "imposible" });
  }

  // create, destroy and encrypt token
  const createTokenUser = async (user, res) => {
    let day = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
    let nextday = dayjs().add(1, "days").format("YYYY-MM-DDTHH:mm:ssZ[Z]");

    delete user["password"];
    const token = jwt.sign(user, process.env.SECRET, { expiresIn: "1d" });
    //hashing token
    const tokenEncrypt = await bcrypt.hash(token, 10);
    if (tokenEncrypt) {
      // destroy token
      ClientsJwt.destroy({where: { client_id: user.id } })
      .then( () => {
        // create token
        ClientsJwt.create({
          client_id: user.id,
          token_encrypt: tokenEncrypt,
          registered_at: day,
          expired_at: nextday,
        })
        .then(() => {
          return res.send({ token });
        })
        .catch(() => {
          return res.status(400).json({ errors: "imposible" });
        });
      })
      .catch(() => {
        return res.status(400).json({ errors: "imposible" });
      });
    }else{
      return res.status(400).json({ errors: "imposible" });
    }
  };
};

// client payment upload
const uploadPayment = () => {};

// client information
const Client = async (req, res) => {
  const session = await validSession(req, res);
  return res.send(session.decoded);
};

// * ADMINISTRATOR FUNCTIONS

// remove client
const destroyClient = (req, res) => {};

// locked client
const lockClient = (req, res) => {};

// unlocked client
const unlockClient = (req, res) => {};

// asing vip client
const addVipClient = () => {};

// remove vip client
const removeVipClient = () => {};

module.exports = {
  storeClient,
  updateClient,
  destroyClient,
  lockClient,
  unlockClient,
  addVipClient,
  removeVipClient,
  loginClient,
  uploadPayment,
  Client,
};
