// Models
const User = require("../../../Models/user");
const Notification = require("../../../Models/notification");
// Helpers
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		const { notification } = await User.findById(req.id).select("notification");
		await Notification.updateMany(
			{ notificationId: { $in: notification } },
			{ $set: { isRead: true } }
		);

		if (res) {
			response.success(res, "");
		}

	} catch (err) {
		response.fail(res, err);
	}
};
