const express = require("express");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", require("./router/router"));

app.get("/", (req, res) => {
  res.send({
    name: "snake club fx",
    development: "dattatech studios",
  });
});

app.listen(port, () => {
  console.log("server actived, port:", port);
});

