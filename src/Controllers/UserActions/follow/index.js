// Models
const User = require("../../../Models/user");
// Helpers
const getUserSocketId = require("../../../Helpers/getUserSocketId");
const response = require("../../../Helpers/response");
// Actions
const newNotification = require("../newNotification");

module.exports = async (req, res) => {
	try {
		const { userToFollow, user, isFollowedByUser } = (
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
						followers: 1,
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
						userToFollow: [
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
						userToFollow: {
							$first: "$userToFollow",
						},
					},
				},
				{
					$project: {
						user: 1,
						userToFollow: 1,
						isFollowedByUser: {
							$cond: {
								if: {
									$and: [
										{
											$in: ["$user._id", "$userToFollow.followingAccount"],
										},
										{
											$in: ["$userToFollow._id", "$user.followingAccount"],
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

		if (!isFollowedByUser) {
			const notification = await newNotification(user, userToFollow, "Followed You!");

			await User.bulkWrite([
				{
					updateOne: {
						filter: {
							accountId: user.accountId,
						},
						update: {
							$addToSet: {
								followingAccount: userToFollow._id,
							},
						},
					},
				},
				{
					updateOne: {
						filter: {
							accountId: userToFollow.accountId,
						},
						update: {
							$addToSet: {
								followers: user._id,
								notification,
							},
						},
						upsert: true,
					},
				},
			]);

			response.success(res, []);
			req.io.to(getUserSocketId(userToFollow.accountId)).emit("notification");
		} else {
			response.fail(res, "User Already Followed");
		}
	} catch (err) {
		response.fail(res, err);
	}
};