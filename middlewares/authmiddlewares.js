const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const requireAuthUser = (req, res, next) => {
  const token = req.cookies.tokenJwt;  //partie 1
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(" ")[1]; //Partie2
  if (token) {
    jwt.verify(token, "net StudySphere secret", async (err, decodedToken) => {
      if (err) {
          res.json("/Problem_token");
      } else {
        req.user = await userModel.findById(decodedToken.id);
        next();
      }
    });
  } else {
    res.json("/pas_de_token");
  }
};
module.exports = { requireAuthUser };
