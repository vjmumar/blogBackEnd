const User = require("../../../Models/user");
const Token = require("../../../Models/mailToken");
//Helpers
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		const user = await User.findOne({ accountId: req.body.id });
		const token = await Token.findOne({ token: req.body.token, accountId: req.body.id });
		if (user && token) {
			await Token.findOneAndRemove({ token: req.body.token });
			response.success(res, []);
			return "Success";
		} else if (!token) {
			response.fail(res, "Token Expired");
			return "Token Expired";
		} else if (!find) {
			response.fail(res, "User Not Found");
			return "User Not Found";
		}
	} catch (err) {
		response.fail(res, err);
	}
};
