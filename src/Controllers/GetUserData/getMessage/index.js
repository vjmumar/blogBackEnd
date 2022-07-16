// Model
const User = require("../../../Models/user");
// Helpers
const response = require("../../../Helpers/response");
// Actions
const readMessages = require("../../UserActions/readMessages");

module.exports = async (req, res) => {
	try {
		await readMessages(req);
		const result = await User.aggregate([
			{
				$facet: {
					sender: [
						{
							$match: {
								accountId: req.body.currentId,
							},
						},
					],
					receiver: [
						{
							$match: {
								accountId: req.body.id,
							},
						},
					],
				},
			},
			{
				$project: {
					sender: {
						$first: "$sender",
					},
					receiver: {
						$first: "$receiver",
					},
					messagesFromReceiver: {
						$first: {
							$filter: {
								input: {
									$first: "$sender.message",
								},
								as: "msg",
								cond: {
									$eq: [
										"$$msg.accountId",
										{
											$first: "$receiver.accountId",
										},
									],
								},
							},
						},
					},
				},
			},
			{
				$lookup: {
					from: "messages",
					localField: "messagesFromReceiver.messages",
					foreignField: "messageId",
					as: "messages",
				},
			},
			{
				$facet: {
					recieverInfo: [
						{
							$project: {
								receiverImage: "$receiver.imageLink",
								receiverFirstName: "$receiver.firstName",
								receiverLastName: "$receiver.lastName",
							},
						},
					],
					allMessages: [
						{
							$project: {
								messages: {
									$slice: ["$messages", -req.body.increment || -10],
								},
							},
						},
					],
					totalMessages: [
						{
							$project: {
								totalMessages: {
									$size: "$messages",
								},
							},
						},
					],
				},
			},
			{
				$project: {
					receiverImage: { $first: "$recieverInfo.receiverImage" },
					receiverFirstName: { $first: "$recieverInfo.receiverFirstName" },
					receiverLastName: { $first: "$recieverInfo.receiverLastName" },
					messages: {
						$first: "$allMessages.messages",
					},
					totalMessages: {
						$first: "$totalMessages.totalMessages",
					},
					totalShowedMessages: {
						$size: {
							$first: "$allMessages.messages",
						},
					},
				},
			},
		]);

		response.success(res, result);
	} catch (err) {
		response.fail(res, err);
	}
};
