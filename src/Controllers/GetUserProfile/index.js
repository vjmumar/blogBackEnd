const User = require("../../Models/user");
//Helpers
const response = require("../../Helpers/response");

const getUserProfile = async (req, res) => {
	try {
		const result = await User.aggregate([
			{
				$facet: {
					currentUser: [
						{
							$match: {
								accountId: req.body.currentUser,
							},
						},
						{
							$project: {
								_id: {
									$toString: "$_id",
								},
								email: 1,
								accountId: 1,
								firstName: 1,
								lastName: 1,
								imageLink: 1,
								aboutMe: 1,
								dateCreated: 1,
								followingAccount: 1,
								followers: 1,
								friends: 1,
								myFriendRequest: 1,
								friendRequest: 1,
							},
						},
					],
					userVisited: [
						{
							$match: {
								accountId: req.body.id,
								verified: true,
							},
						},
						{
							$project: {
								_id: {
									$toString: "$_id",
								},
								email: 1,
								accountId: 1,
								firstName: 1,
								lastName: 1,
								imageLink: 1,
								followers: 1,
								aboutMe: 1,
								dateCreated: 1,
								followingAccount: 1,
								friendRequest: 1,
								friends: 1,
								myFriendRequest: 1,
							},
						},
					],
				},
			},
			{
				$project: {
					email: {
						$first: "$userVisited.email",
					},
					firstName: {
						$first: "$userVisited.firstName",
					},
					lastName: {
						$first: "$userVisited.lastName",
					},
					imageLink: {
						$first: "$userVisited.imageLink",
					},
					aboutMe: {
						$first: "$userVisited.aboutMe",
					},
					dateCreated: {
						$first: "$userVisited.dateCreated",
					},
					followingAccount: {
						$first: "$userVisited.followingAccount",
					},
					friends: {
						$first: "$userVisited.friends",
					},
					accountId: {
						$first: "$userVisited.accountId",
					},
					followers: {
						$first: "$userVisited.followers",
					},
					isCurrentUser: {
						$cond: {
							if: {
								$eq: [
									{
										$first: "$userVisited.accountId",
									},
									{
										$first: "$currentUser.accountId",
									},
								],
							},
							then: true,
							else: false,
						},
					},
					isAfriendOfCurrentUser: {
						$cond: {
							if: { $size: "$currentUser" },
							then: {
								$in: [
									{
										$first: "$userVisited._id",
									},
									{
										$first: "$currentUser.friends",
									},
								],
							},
							else: false,
						},
					},
					isRequestedToBeFriendByCurrentUser: {
						$cond: {
							if: { $size: "$currentUser" },
							then: {
								$in: [
									{
										$first: "$userVisited._id",
									},
									{
										$first: "$currentUser.myFriendRequest",
									},
								],
							},
							else: false,
						},
					},
					isRequestedToBeFriendByUser: {
						$cond: {
							if: { $size: "$currentUser" },
							then: {
								$in: [
									{
										$first: "$currentUser._id",
									},
									{
										$first: "$userVisited.myFriendRequest",
									},
								],
							},
							else: false,
						},
					},
					isFollowedByCurrentUser: {
						$cond: {
							if: { $size: "$currentUser" },
							then: {
								$in: [
									{
										$first: "$userVisited._id",
									},
									{
										$first: "$currentUser.followingAccount",
									},
								],
							},
							else: false,
						},
					},
				},
			},
		]);
		response.success(res, ...result);
	} catch (err) {
		response.fail(req, err);
	}
};

module.exports = getUserProfile;
