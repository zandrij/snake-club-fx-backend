const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UsersJwt = require("../../models/users-jwt");

const validSession = (req, res) => {
    try {
        const token = req.headers["snake-x"];
        const decoded = jwt.verify(token, process.env.SECRET);
        return decoded;
    } catch (error) {
        res.status(400).send("Invalid token.");
    }
}

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

module.exports = {
    validSession,
    verifyToken
}