//Model
const User = require("../../../Models/user");
//Helpers
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		const users = await User.find().select("firstName lastName accountId imageLink");
		response.success(res, users);
	} catch (err) {
		response.fail(res, []);
	}
};
