const User = require("../../Models/user");
//Helper
const response = require("../../Helpers/response");

const getUserFriends = async (req, res) => {
	try {
		const result = await User.aggregate([
			{
				$facet: {
					currentUser: [
						{
							$match: {
								accountId: req.body.id,
							},
						},
					],
					allUsers: [
						{
							$match: {
								verified: true
							}
						},
						{
							$project: {
								_id: {
									$toString: "$_id",
								},
								firstName: 1,
								lastName: 1,
								accountId: 1,
								message: 1,
								imageLink: 1,
								friends: 1,
							},
						},
					],
				},
			},
			{
				$project: {
					currentUser: {
						$first: "$currentUser",
					},
					friends: {
						$filter: {
							input: "$allUsers",
							as: "friend",
							cond: {
								$in: [
									"$$friend._id",
									{
										$first: "$currentUser.friends",
									},
								],
							},
						},
					},
				},
			},
			{
				$unwind: {
					path: "$friends",
				},
			},
			{
				$project: {
					firstName: "$friends.firstName",
					lastName: "$friends.lastName",
					imageLink: "$friends.imageLink",
					accountId: "$friends.accountId",
					messagesFromCurrentUser: {
						$first: {
							$filter: {
								input: "$currentUser.message",
								as: "msg",
								cond: {
									$eq: ["$$msg.accountId", "$friends.accountId"],
								},
							},
						},
					},
				},
			},
			{
				$lookup: {
					from: "messages",
					localField: "messagesFromCurrentUser.messages",
					foreignField: "messageId",
					as: "messages",
				},
			},
			{
				$project: {
					firstName: 1,
					lastName: 1,
					imageLink: 1,
					accountId: 1,
					latestMessage: {
						$cond: {
							if: {
								$size: "$messages",
							},
							then: {
								$first: {
									$reverseArray: "$messages",
								},
							},
							else: "",
						},
					},
					allMessageThatCurrentUserIsTheReceiver: {
						$filter: {
							input: "$messages",
							as: "msg",
							cond: {
								$and: [
									{
										$eq: ["$$msg.receiver", req.body.id],
									},
								],
							},
						},
					},
				},
			},
			{
				$sort: {
					[req.body.isMessage ? "latestMessage.dateCreated" : "firstName"]: -1,
				},
			},
			{
				$facet: {
					count: [
						{
							$project: {
								accountId: 1,
							},
						},
					],
					result: [
						{
							$match: {
								$expr: {
									$regexMatch: {
										input: {
											$concat: ["$firstName", " ", "$lastName"],
										},
										regex: req.body.search || "",
										options: "ix",
									},
								},
							},
						},
						{
							$project: {
								firstName: 1,
								lastName: 1,
								imageLink: 1,
								accountId: 1,
								latestMessage: 1,
								haveNoUnreadMessagesFromUser: {
									$cond: {
										if: {
											$size: "$allMessageThatCurrentUserIsTheReceiver",
										},
										then: {
											$allElementsTrue:
												"$allMessageThatCurrentUserIsTheReceiver.isReadByReceiver",
										},
										else: true,
									},
								},
							},
						},
						{
							$limit: (req.body.isMessage ? Number.MAX_SAFE_INTEGER : req.body.increment || 5),
						},
					],
				},
			},
			{
				$project: {
					friends: "$result",
					totalFriends: {
						$size: "$count",
					},
				},
			},
		]);

		response.success(res, { ...result });
	} catch (err) {
		response.fail(res, err);
	}
};

module.exports = getUserFriends;
