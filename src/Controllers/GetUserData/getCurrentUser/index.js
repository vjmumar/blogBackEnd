//Model
const User = require("../../../Models/user");
//Helpers
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		const user = await User.findById(req.id).select("-password -id");
		response.success(res, user);
	} catch (err) {
		response.fail(req, "User Not Found");
	}
};;
