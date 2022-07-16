const User = require("../../../Models/user");

//Helpers
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		const result = await User.aggregate([
			{
				$facet: {
					allUser: [
						{
							$project: {
								_id: {
									$toString: "$_id",
								},
								firstName: 1,
								lastName: 1,
								imageLink: 1,
								accountId: 1,
								publishedStories: 1,
							},
						},
					],
					currentUser: [
						{
							$match: {
								$expr: {
									$eq: [
										"$_id",
										{
											$toObjectId: req.id,
										},
									],
								},
							},
						},
						{
							$project: {
								firstName: 1,
								lastName: 1,
								imageLink: 1,
								accountId: 1,
								followingAccount: 1,
								publishedStories: 1,
							},
						},
					],
				},
			},
			{
				$project: {
					followingAccounts: {
						$filter: {
							input: "$allUser",
							as: "user",
							cond: {
								$in: [
									"$$user._id",
									{
										$first: "$currentUser.followingAccount",
									},
								],
							},
						},
					},
				},
			},
			{
				$unwind: {
					path: "$followingAccounts",
				},
			},
			{
				$project: {
					accountId: "$followingAccounts.accountId",
					firstName: "$followingAccounts.firstName",
					lastName: "$followingAccounts.lastName",
					publishedStories: "$followingAccounts.publishedStories",
					imageLink: "$followingAccounts.imageLink",
				},
			},
			{
				$lookup: {
					from: "stories",
					localField: "publishedStories",
					foreignField: "id",
					as: "story",
				},
			},
			{
				$unwind: {
					path: "$story",
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
					allStories: [
						{
							$project: {
								firstName: 1,
								lastName: 1,
								imageLink: 1,
								accountId: 1,
								story: 1,
								isUserLikedThisStory: {
									$cond: {
										if: "$story.likes",
										then: {
											$in: [req.body.id, "$story.likes"],
										},
										else: false,
									},
								},
							},
						},
						{
							$sort: {
								"story.dateCreated": -1,
							},
						},
						{
							$limit: req.body.increment || 5,
						},
					],
				},
			},
			{
				$project: {
					stories: "$allStories",
					totalStories: {
						$size: "$count",
					},
				},
			},
		]);

		response.success(res, ...result);
	} catch (err) {
		response.fail(res, err);
	}
};
