// Models
const User = require("../../../Models/user");
// Helpers
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		const { user, userToUnfriend, isAfriendByUser } = (
			await User.aggregate([
				{
					$project: {
						_id: {
							$toString: "$_id",
						},
						firstName: 1,
						lastName: 1,
						accountId: 1,
						friends: 1,
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
						userToUnfriend: [
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
						userToUnfriend: {
							$first: "$userToUnfriend",
						},
					},
				},
				{
					$project: {
						user: 1,
						userToUnfriend: 1,
						isAfriendByUser: {
							$cond: {
								if: {
									$and: [
										{
											$in: ["$user._id", "$userToUnfriend.friends"],
										},
										{
											$in: ["$userToUnfriend._id", "$user.friends"],
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

		if (isAfriendByUser) {
			await User.bulkWrite([
				{
					updateOne: {
						filter: {
							accountId: user.accountId,
						},
						update: {
							$pull: {
								friends: userToUnfriend._id,
							},
						},
					},
				},
				{
					updateOne: {
						filter: {
							accountId: userToUnfriend.accountId,
						},
						update: {
							$pull: {
								friends: user._id,
							},
						},
					},
				},
			]);
			response.success(res, []);
		} else {
			response.fail(res, "Friend Not Found");
		}
	} catch (err) {
		response.fail(res, err);
	}
};
