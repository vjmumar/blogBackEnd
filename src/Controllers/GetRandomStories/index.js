const User = require("../../Models/user");
// Helpers
const response = require("../../Helpers/response");

const getRandomStories = async (req, res) => {
	try {
		const result = await User.aggregate([
            {
                $match: {
                    accountId: {
                        $ne: req.body.currentId || ''
                    }
                }
            },
			{
				$project: {
					firstName: 1,
					lastName: 1,
					imageLink: 1,
					accountId: 1,
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
				$sample: {
					size: 5,
				},
			},
			{
				$project: {
					firstName: 1,
					lastName: 1,
					imageLink: 1,
					accountId: 1,
					story: 1,
				},
			},
		]);
		response.success(res, result);
	} catch (err) {
		response.fail(res, err);
	}
};

module.exports = getRandomStories;
