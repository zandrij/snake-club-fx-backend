const express = require("express");
const { getUser } = require("../controllers/users/users-controller");
const router = express.Router();

router.get('/user', getUser);
