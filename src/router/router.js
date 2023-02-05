const express = require("express");
const { check } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  storeUser,
  loginUser,
  getUser,
} = require("../controllers/users/users-controller");
const UsersJwt = require("../models/users-jwt");

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers["snake-x"];
  //verificamos el token
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
      //verificar si el token es valido
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded;

      UsersJwt.findOne({
        where: { user_id: decoded.id}
      })
      .then(res => {
        bcrypt.compare(token, res.token_encrypt, async (err, result) => {
          if(err) return res.status(400).json({ errors: errors.array() });

          if(result){
            next();
          }else{
            res.status(400).send("Invalid token.");
          }
        });
      })
      next();
  } catch (error) {
      res.status(400).send("Invalid token.");
  }
}

router.post("/register", [
  check('email').isEmail(),
  check('password').isLength({ min: 8 }),
  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  })
], storeUser);

router.post("/login", [
  check('email').isEmail().withMessage('email invalid'),
  check('password').isLength({ min: 8}).withMessage('password invalid, minimun 8 digits'),
], loginUser);

router.get("/user", verifyToken, getUser);

module.exports = router;
