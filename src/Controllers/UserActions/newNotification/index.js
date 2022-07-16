const Notification = require("../../../Models/notification");
// Random Id Generator
const { uid } = require("uid");
const uniqid = require('uniqid'); 

module.exports = async (user, userToNotify, message) => {
	try {
		const result = await Notification.insertMany({
			to: userToNotify.accountId,
			from: user.accountId,
			notificationId: `noti-${uid(10)}-${uniqid()}`,
			message: message,
		});

		return result[0].notificationId;
	} catch (err) {
		throw err;
	}
};
