const { validationResult } = require("express-validator");
const Clients = require("../../models/clients-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ClientsJwt = require("../../models/clients-jwt");
const dayjs = require("dayjs");
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

        res.send({ ok: "success" });
        return;
      })
      .catch((err) => {
        if (err.parent.errno === 1062)
          return res.send({ error: "register duplicate" });
      });

    return;
  } catch (error) {
    res.send({ error: "error" }, 404);
    return;
  }
};

// client information update
const updateClient = (req, res) => {};

// client login
const loginClient = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    Clients.findOne({
    where: { email: email },
    })
    .then((user) => {
        bcrypt.compare(password, user.password, async (err, result) => {
        if (err) return res.status(400).json({ errors: "imposible" });

        if (result) {
        await createTokenUser(user.dataValues);
        } else {
        res.status(400).json({ errors: "incorrect password" });
        }
    });
    })
    .catch(() => {
        res.status(400).json({ errors: "user no register" });
    });
  } catch (error) {
    res.status(400).json({ errors: "imposible" });
  }

  // create, destroy and encrypt token
  const createTokenUser = async (user) => {
    let day = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
    let nextday = dayjs().add(1, "days").format("YYYY-MM-DDTHH:mm:ssZ[Z]");

    delete user["password"];
    const token = jwt.sign(user, process.env.SECRET, { expiresIn: "1d" });
    const tokenEncrypt = await bcrypt.hash(token, 10);

    if (tokenEncrypt) {
      // destroy token
      ClientsJwt.destroy({
        where: {
          client_id: user.id,
        },
      });
      // create token
      ClientsJwt.create({
        client_id: user.id,
        token_encrypt: tokenEncrypt,
        registered_at: day,
        expired_at: nextday,
      })
        .then(() => {
          res.send({ token });
        })
        .catch((error) => {
          res.status(400).json({ errors: "imposible" });
        });
    }
  };
};

// client payment upload
const uploadPayment = () => {};

// client information
const Client = () => {};

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
