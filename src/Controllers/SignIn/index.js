//Bcrypt and Settings
const bcrypt = require("bcrypt");

//Model
const User = require("../../Models/user");

//Response
const response = require("../../Helpers/response");

//Token
const jwt = require('../../Helpers/jwt')

const signIn = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const compareHashPassword = await bcrypt.compare(req.body.password, user.password);
    const token = jwt.getToken(user._id);
    if (user && compareHashPassword) {
      if (compareHashPassword && user.verified) {
        response.success(res,[{token: token, accountId: user.accountId}]);
      } else {
        response.fail(res,"User Is Not Verified");
      }
    } else {
      response.fail(res, "Wrong Email/Password");
    }
  } catch (err) {
    response.fail(res, "Wrong Email/Password");
  }
};

module.exports = signIn;
