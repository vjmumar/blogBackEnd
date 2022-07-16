// Models
const Stories = require("../../../Models/stories");

// Helpers
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		const result = await Stories.aggregate([
			{
				$match: {
					id: req.body.storyId,
				},
			},
			{
				$project: {
					comments: 1,
				},
			},
			{
				$unwind: {
					path: "$comments",
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "comments.sender",
					foreignField: "accountId",
					as: "user",
				},
			},
			{
				$facet: {
					allComments: [
						{
							$project: {
								commentId: "$comments.commentId",
							},
						},
					],
					filteredResult: [
						{
							$project: {
								data: "$comments",
								senderFirstName: {
									$first: "$user.firstName",
								},
								senderLastName: {
									$first: "$user.lastName",
								},
								senderImage: {
									$first: "$user.imageLink",
								},
							},
						},
					],
				},
			},
			{
				$project: {
					comments: {
						$reverseArray: {
							$slice: [
								{
									$reverseArray: "$filteredResult",
								},
								0,
								req.body.increment,
							],
						},
					},
					size: {
						$size: "$allComments",
					},
				},
			},
		]);
		response.success(res, ...result);
	} catch (err) {
		response.fail(res, []);
	}
};

