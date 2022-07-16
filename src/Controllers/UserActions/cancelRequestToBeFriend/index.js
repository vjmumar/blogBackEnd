// Models
const User = require("../../../Models/user");
// Helpers
const response = require("../../../Helpers/response");

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
											$in: ["$user._id", "$userToRequest.friendRequest"],
										},
										{
											$in: ["$userToRequest._id", "$user.myFriendRequest"],
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
			await User.bulkWrite([
				{
					updateOne: {
						filter: {
							accountId: user.accountId,
						},
						update: {
							$pull: {
								myFriendRequest: userToRequest._id,
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
								friendRequest: user._id,
							},
						},
					},
				},
			]);
			response.success(res, []);
		} else {
			response.fail(res, "Request Not Found");
		}
	} catch (err) {
		response.fail(res, err);
	}
};
