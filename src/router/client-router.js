const { check } = require("express-validator");

const express = require("express");
const {
  storeClient,
  loginClient,
  updateClient,
  uploadPayment,
  Client,
} = require("../controllers/clients/clients-controller");
const { verifyTokenClient } = require("../controllers/utils/utils");
const router = express.Router();

router.post(
  "/register",
  [
    check("name").not().isEmpty().withMessage("name required"),
    check("email").not().isEmpty().isEmail().withMessage("email invalid"),
    check("country").not().isEmpty().isString().withMessage("country required"),
    check("password").not().isEmpty().isLength({ min: 8 }).withMessage("password invalid"),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ],
  storeClient
);

router.post(
  "/login",
  [
    check("email").not().isEmpty().isEmail().withMessage("email invalid"),
    check("password").not().isEmpty().isLength({ min: 8 }).withMessage("password invalid"),
  ],
  loginClient
);

router.put("/update", verifyTokenClient, updateClient);
router.post("/upload-payment",  uploadPayment);
router.get("/client", verifyTokenClient, Client);

module.exports = router;