// Helpers
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		const { doesUserBookmarkedThisStory } = (
			await User.aggregate([
				{
					$match: {
						accountId: req.body.userId,
					},
				},
				{
					$project: {
						doesUserBookmarkedThisStory: {
							$cond: {
								if: "$bookMarks",
								then: { $in: [req.body.storyId, "$bookMarks.story"] },
								else: false,
							},
						},
					},
				},
			])
		)[0];

		await User.updateOne(
			{ accountId: req.body.userId },
			{
				$addToSet: {
					...(!doesUserBookmarkedThisStory && {
						bookMarks: {
							author: req.body.ownerId,
							story: req.body.storyId,
						},
					}),
				},
				$pull: {
					...(doesUserBookmarkedThisStory && {
						bookMarks: {
							author: req.body.ownerId,
							story: req.body.storyId,
						},
					}),
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
