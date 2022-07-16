// Models
const User = require("../../../Models/user");
// Helpers
const getUserSocketId = require("../../../Helpers/getUserSocketId");
const response = require("../../../Helpers/response");
// Actions
const newNotification = require("../newNotification");

module.exports = async (req, res) => {
	try {
		const { user, userToRequest, isBothUserRequestingOnEachOther } = (
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
						isBothUserRequestingOnEachOther: {
							$cond: {
								if: {
									$and: [
										{
											$in: [
												"$userToRequest.accountId",
												"$user.myFriendRequest",
											],
										},
										{
											$in: [
												"$user.accountId",
												"$userToRequest.myFriendRequest",
											],
										},
										{
											$in: [
												"$user.accountId",
												"$userToRequest.friendRequest",
											],
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

		if (!isBothUserRequestingOnEachOther) {
			const notification = await newNotification(
				user,
				userToRequest,
				"Sent You A Friend Request!"
			);
			await User.bulkWrite([
				{
					updateOne: {
						filter: {
							accountId: user.accountId,
						},
						update: {
							$addToSet: {
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
							$addToSet: {
								friendRequest: user._id,
								notification,
							},
						},
					},
				},
			]);
			req.io.to(getUserSocketId(userToRequest.accountId)).emit("notification");
			response.success(res, []);
		} else {
			response.fail(res, "User Already Requesting To Be Friend");
		}
	} catch (err) {
        throw err
		response.fail(res, err);
	}
};
