// Models
const User = require("../../../Models/user");
// Helpers
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		const { user, userToUnFollow, isFollowedByUser } = (
			await User.aggregate([
				{
					$project: {
						_id: {
							$toString: "$_id",
						},
						firstName: 1,
						lastName: 1,
						accountId: 1,
						followingAccount: 1,
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
						userToUnFollow: [
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
						userToUnFollow: {
							$first: "$userToUnFollow",
						},
					},
				},
				{
					$project: {
						user: 1,
						userToUnFollow: 1,
						isFollowedByUser: {
							$cond: {
								if: {
									$and: [
										{
											$in: ["$userToUnFollow._id", "$user.followingAccount"],
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

		if (isFollowedByUser) {
			await User.bulkWrite([
				{
					updateOne: {
						filter: {
							accountId: user.accountId,
						},
						update: {
							$pull: {
								followingAccount: userToUnFollow._id,
							},
						},
					},
				},
				{
					updateOne: {
						filter: {
							accountId: userToUnFollow.accountId,
						},
						update: {
							$pull: {
								followers: user._id,
							},
						},
						upsert: true,
					},
				},
			]);
			response.success(res, []);
		} else {
			response.fail(res, "Followed User Not Found");
		}
	} catch (err) {
		response.fail(res, err);
	}
};