const User = require("../../../Models/user");
const Token = require("../../../Models/mailToken");
// Helpers
const response = require("../../../Helpers/response");
const sendEmail = require("../../../Helpers/mailer");
// RandomGenerator
const { uid } = require("uid");
const uniqid = require("uniqid");

module.exports = async (req, res) => {
	try {
		const user = await User.findOne({
			$expr: {
				$or: [
					{
						$eq: ["$email", req.body.email],
					},
					{
						$eq: ["$accountId", req.body.id],
					},
				],
			},
		});
		if (user) {
			const token = `token-${uid(15)}-${uniqid()}`;
			// Send Email
			await sendEmail({
				email: user.email,
				firstName: user.firstName,
				accountId: user.accountId,
				type: req.body.type,
				token,
			});

			// Insert New Token
			await Token.create({
				accountId: user.accountId,
				token,
			});

			response.success(res, "Request Success");
			return "Success";
		} else {
			response.fail(res, "User Not Found");
		}
	} catch (err) {
		response.fail(res, err);
	}
};
