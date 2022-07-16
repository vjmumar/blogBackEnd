const User = require("../../Models/user");
//Helper
const response = require("../../Helpers/response");

const getLatestStories = async (req, res) => {
	try {
		const result = await User.aggregate([
			{
				$match: {
					accountId: {
						$ne: req.body.id,
					},
				},
			},
			{
				$project: {
					firstName: 1,
					lastName: 1,
					accountId: 1,
					imageLink: 1,
					publishedStories: 1,
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
					allStories: [
						{
							$project: {
								story: 1,
							},
						},
						{
							$limit: 100
						}
					],
					stories: [	
						{
							$project: {
								firstName: 1,
								lastName: 1,
								imageLink: 1,
								accountId: 1,
								isUserLikedThisStory: {
									$cond: {
										if:  "$story.likes",
										then: {
											$in: [req.body.id, "$story.likes"]
										},
										else: false
									}
								},
								story: 1,
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
					stories: "$stories",
					totalStories: {
						$size: "$allStories",
					},
				},
			},
		]);

		response.success(res, ...result);
	} catch (err) {
		response.fail(res, err);
	}
};

module.exports = getLatestStories;
