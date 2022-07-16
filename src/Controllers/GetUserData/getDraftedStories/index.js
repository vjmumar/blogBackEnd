//Model
const User = require("../../../Models/user");
//Helpers
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		const isLatest = req.body.sort === "latest";
		const result = await User.aggregate([
			{
				$match: {
					accountId: req.body.id,
				},
			},
			{
				$project: {
					firstName: 1,
					lastName: 1,
					accountId: 1,
					draftedStories: 1,
					imageLink: 1,
				},
			},
			{
				$lookup: {
					from: "stories",
					localField: "draftedStories",
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
				$match: {
					"story.title": {
						$regex: req.body.searched || "",
						$options: "ix",
					},
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
					],
					stories: [
						{
							$project: {
								firstName: 1,
								lastName: 1,
								accountId: 1,
								story: 1,
								imageLink: 1,
							},
						},
						{
							$sort: {
								"story.dateCreated": isLatest ? -1 : 1,
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

		response.success(res, { ...result });
	} catch (err) {
		response.fail(res, err);
	}
};
