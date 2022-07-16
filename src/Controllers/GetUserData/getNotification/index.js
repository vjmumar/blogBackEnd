const notification = require("../../../Models/notification");
// Helpers
const response = require("../../../Helpers/response");
// Actions
const readNotifications = require("../../UserActions/readNotifications");
const getMessageNotification = require("../getMessageNotification");

module.exports = async (req, res) => {
	try {
		if (req.body.readAllNotifications) {
			await readNotifications(req);
		}

		const totalOFriendWhoHaveUnreadMessages = await getMessageNotification(req);

		const result = await notification.aggregate([
			{
				$match: {
					to: req.body.accountId,
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "accountId",
					foreignField: "from",
					as: "users",
				},
			},
			{
				$project: {
					from: {
						$first: {
							$filter: {
								input: "$users",
								as: "user",
								cond: {
									$eq: ["$$user.accountId", "$from"],
								},
							},
						},
					},
					message: 1,
					dateCreated: 1,
					isRead: 1,
					notificationId: 1,
				},
			},
			{
				$facet: {
					allNotification: [
						{
							$project: {
								senderAccountId: "$from.accountId",
								isRead: "$isRead",
							},
						},
					],
					notifications: [
						{
							$project: {
								senderAccountId: "$from.accountId",
								senderFirstName: "$from.firstName",
								senderLastName: "$from.lastName",
								senderImage: "$from.imageLink",
								message: 1,
								dateCreated: 1,
								isRead: 1,
								notificationId: 1,
							},
						},
						{
							$sort: {
								dateCreated: -1,
							},
						},
						{
							$limit: req.body.increment,
						},
					],
				},
			},
			{
				$project: {
					totalNotifications: {
						$size: "$allNotification",
					},
					totalOfUnreadNotifications: {
						$size: {
							$filter: {
								input: "$allNotification",
								as: "noti",
								cond: {
									$eq: ["$$noti.isRead", false],
								},
							},
						},
					},
					notifications: "$notifications",
				},
			},
		]);

		response.success(res, {
			...result[0],
			totalOFriendWhoHaveUnreadMessages,
		});
	} catch (err) {
		response.fail(res, err);
	}
};
