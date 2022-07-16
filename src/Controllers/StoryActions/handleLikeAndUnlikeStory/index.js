// Models
const Stories = require("../../../Models/stories");

// Helpers
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		const { isUserAlreadyLikedTheStory } = (
			await Stories.aggregate([
				{
					$match: {
						id: req.body.storyId,
					},
				},
				{
					$project: {
						isUserAlreadyLikedTheStory: {
							$cond: {
								if: "$likes",
								then: { $in: [req.body.userId, "$likes"] },
								else: false,
							},
						},
					},
				},
			])
		)[0];

		await Stories.updateOne(
			{ id: req.body.storyId },
			{
				$addToSet: {
					...(!isUserAlreadyLikedTheStory && { likes: req.body.userId }),
				},
				$pull: {
					...(isUserAlreadyLikedTheStory && { likes: req.body.userId }),
				},
			},
			{
				upsert: true,
			}
		);
		response.success(res, []);
	} catch (err) {
		response.fail(res, err);
	}
};
