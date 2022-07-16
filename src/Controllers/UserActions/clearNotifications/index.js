// Models
const User = require("../../../Models/user");
const Notification = require("../../../Models/notification");
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		const result = await User.findByIdAndUpdate(req.id, {
			$set: {
				notification: [],
			},
		});

		await Notification.deleteMany({ $in: result.notification });
		response.success(res, []);
	} catch (err) {
		response.fail(req, err);
	}
};
