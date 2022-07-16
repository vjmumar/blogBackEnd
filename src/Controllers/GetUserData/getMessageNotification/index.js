const User = require("../../../Models/user");
// Helpers
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		const result = await User.aggregate([
			{
				$match: {
					accountId: req.body.accountId,
				},
			},
			{
				$project: {
					currentUserAccountId: "$accountId",
					message: 1,
				},
			},
			{
				$unwind: {
					path: "$message",
				},
			},
			{
				$lookup: {
					from: "messages",
					localField: "message.messages",
					foreignField: "messageId",
					as: "msg",
				},
			},
			{
				$facet: {
					allUserWhoHaveUnreadMessages: [
						{
							$project: {
								accountId: "$message.accountId",
								msg: {
									$filter: {
										input: "$msg",
										as: "msg",
										cond: {
											$eq: ["$$msg.receiver", "$currentUserAccountId"],
										},
									},
								},
							},
						},
					],
				},
			},
			{
				$project: {
					totalOFriendWhoHaveUnreadMessages: {
						$size: {
							$filter: {
								input: "$allUserWhoHaveUnreadMessages",
								as: "users",
								cond: {
									$ne: [
										{
											$allElementsTrue: "$$users.msg.isReadByReceiver",
										},
										true,
									],
								},
							},
						},
					},
				},
			},
		]);

		if (res) {
			response.success(res, ...result);
		} else {
			return result[0]?.totalOFriendWhoHaveUnreadMessages || 0;
		}
	} catch (err) {
		response.fail(res, err);
	}
};
