const express = require("express");
const { check } = require("express-validator");
const {
  storeUser,
  loginUser,
  getUser,
} = require("../controllers/users/users-controller");
const { verifyToken } = require("../controllers/utils/utils");

const router = express.Router();

router.post(
  "/register",
  [
    check("email").not().isEmpty().isEmail().withMessage("email invalid"),
    check("password").not().isEmpty().isLength({ min: 8 }).withMessage("password invalid"),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ],
  storeUser
);

router.post(
  "/login",
  [
    check("email").not().isEmpty().isEmail().withMessage("email invalid"),
    check("password").not().isEmpty().isLength({ min: 8 }).withMessage("password invalid"),
  ],
  loginUser
);

router.get("/user", verifyToken, getUser);


module.exports = router;
