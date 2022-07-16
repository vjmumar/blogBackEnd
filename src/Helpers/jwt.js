//Constant
const { PRIVATE_KEY } = require("../Constants/index");
//JWT
const jwt = require("jsonwebtoken");
//Helpers
const response = require('../Helpers/response');

const getToken = (data) => {
  const token = jwt.sign({ data: data }, String(PRIVATE_KEY));
  return token;
};

const authenticateToken = (req,res,next) => {
  try {
    const token = req.headers['authorization'].split(" ")[1];
    const decodedToken = jwt.verify(token, String(PRIVATE_KEY));
    req.id = decodedToken.data;
    next();
  } catch (err) {
    response.fail(res,'Invalid Token');
  }
};

module.exports = {
  getToken,
  authenticateToken,
};
