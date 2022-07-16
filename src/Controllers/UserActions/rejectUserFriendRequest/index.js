// Models
const User = require("../../../Models/user");
// Helpers
const getUserSocketId = require("../../../Helpers/getUserSocketId");
const response = require("../../../Helpers/response");
// Actions
const newNotification = require("../newNotification");

module.exports = async (req, res) => {
	try {
		const { user, userToRequest, isRequestExisted } = (
			await User.aggregate([
				{
					$project: {
						_id: {
							$toString: "$_id",
						},
						firstName: 1,
						lastName: 1,
						accountId: 1,
						friendRequest: 1,
						myFriendRequest: 1,
					},
				},
				{
					$facet: {
						user: [
							{
								$match: {
									_id: req.id,
								},
							},
						],
						userToRequest: [
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
						user: {
							$first: "$user",
						},
						userToRequest: {
							$first: "$userToRequest",
						},
					},
				},
				{
					$project: {
						user: 1,
						userToRequest: 1,
						isRequestExisted: {
							$cond: {
								if: {
									$and: [
										{
											$in: ["$user._id", "$userToRequest.myFriendRequest"],
										},
										{
											$in: ["$userToRequest._id", "$user.friendRequest"],
										},
									],
								},
								then: true,
								else: false,
							},
						},
					},
				},
			])
		)[0];

		if (isRequestExisted) {
			const notification = await newNotification(
				user,
				userToRequest,
				"Rejected Your Request"
			);
			await User.bulkWrite([
				{
					updateOne: {
						filter: {
							accountId: user.accountId,
						},
						update: {
							$pull: {
								friendRequest: userToRequest._id,
							},
						},
					},
				},
				{
					updateOne: {
						filter: {
							accountId: userToRequest.accountId,
						},
						update: {
							$pull: {
								myFriendRequest: user._id,
							},
							$addToSet: {
								notification,
							},
						},
					},
				},
			]);
			response.success(res, []);
			req.io.to(getUserSocketId(userToRequest.accountId)).emit("notification");
		} else {
			response.fail(res, "Request Not Found");
		}
	} catch (err) {
		response.fail(res, err);
	}
};
