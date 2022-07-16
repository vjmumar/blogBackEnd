// Models
const User = require("../../../Models/user");
//Helpers
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		const searched = req.body.searched.toLowerCase().trim() || "";
		const result = await User.aggregate([
			{
				$match: {
					accountId: {
						$ne: req.body.accountId || "",
					},
				},
			},
			{
				$project: {
					firstName: 1,
					lastName: 1,
					aboutMe: 1,
					accountId: 1,
					publishedStories: 1,
					imageLink: 1,
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
					allResult: [
						{
							$match: {
								$expr: {
									$regexMatch: {
										input: {
											$concat: [
												"$firstName",
												" ",
												"$lastName",
												" ",
												"$story.title",
												" ",
												"$story.text",
											],
										},
										regex: searched,
										options: "ix",
									},
								},
							},
						},
					],
					filteredResult: [
						{
							$match: {
								$expr: {
									$regexMatch: {
										input: {
											$concat: [
												"$firstName",
												" ",
												"$lastName",
												" ",
												"$story.title",
												" ",
												"$story.text",
											],
										},
										regex: searched,
										options: "ix",
									},
								},
							},
						},
						{
							$project: {
								firstName: 1,
								lastName: 1,
								aboutMe: 1,
								accountId: 1,
								imageLink: 1,
								story: 1,
								isUserLikedThisStory: {
									$cond: {
										if:  "$story.likes",
										then: {
											$in: [req.body.accountId, "$story.likes"]
										},
										else: false
									}
								},
							},
						},
					],
				},
			},
			{
				$project: {
					stories: {
						$slice: [{$reverseArray: "$filteredResult"}, req.body.increment || 5]
					},
					totalStories: {
						$size: "$allResult",
					},
				},
			},
		]);
		response.success(res, ...result);
	} catch (err) {
		response.fail(res, err);
	}
};
