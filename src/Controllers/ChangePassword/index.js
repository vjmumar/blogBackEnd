const User = require("../../Models/user");
// Helpers
const response = require("../../Helpers/response");
// Actions
const verify = require("../../Controllers/EmailActions/verify");
// Bcrypt
const bcrypt = require("bcrypt");

const changePassword = async (req, res) => {
	try {
		const verifyToken = await verify(req);
		if (verifyToken === "Success") {
			const newHashPassword = await bcrypt.hash(req.body.newPassword, 10);
			await User.findOneAndUpdate(
				{ accountId: req.body.id },
				{
					$set: {
						password: newHashPassword,
					},
				}
			);
			response.success(res, "Password Updated Successfully");
		} else {
			response.fail(res, verifyToken);
		}
	} catch (err) {
		response.fail(res, err);
	}
};

module.exports = changePassword;
