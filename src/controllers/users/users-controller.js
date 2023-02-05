const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
dayjs.locale("es_ES");
const User = require("../../models/users-model");
const UsersJwt = require("../../models/users-jwt");
const { validSession } = require("../utils/utils");

const storeUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    let newUser = {
      name,
      email,
      password,
    };

    User.create(newUser)
      .then(() => {
        res.send({ ok: "success" });
      })
      .catch((err) => {
        if (err.parent.errno === 1062)
          res.send({ error: "register duplicate" });
      });
  } catch (error) {
    res.send({ error: "error" }, 404);
    return;
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // search user
    User.findOne({
      where: { email: email },
    })
      .then((user) => {
        // compare password
        bcrypt.compare(password, user.password, async (error, result) => {
          if (error) return res.status(400).json({ errors: "imposible" });

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
      UsersJwt.destroy({
        where: {
          user_id: user.id,
        },
      });
      // create token
      UsersJwt.create({
        user_id: user.id,
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

const getUser = async (req, res) => {
  const session = await validSession(req, res);
  res.send(session.decoded);
};

module.exports = {
  storeUser,
  loginUser,
  getUser,
};
