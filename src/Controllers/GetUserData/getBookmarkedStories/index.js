//Model
const User = require("../../../Models/user");
//Helpers
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		const isLatest = req.body.sort === "latest";
		const result = await User.aggregate([
			{
				$facet: {
					allUser: [
						{
							$project: {
								firstName: 1,
								lastName: 1,
								accountId: 1,
								imageLink: 1,
								publishedStories: 1,
							},
						},
					],
					currentUser: [
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
					currentUser: {
						$first: "$currentUser",
					},
					allBookMarkedAuthor: {
						$filter: {
							input: "$allUser",
							as: "user",
							cond: {
								$in: [
									"$$user.accountId",
									{
										$first: "$currentUser.bookMarks.author",
									},
								],
							},
						},
					},
				},
			},
			{
				$unwind: {
					path: "$allBookMarkedAuthor",
				},
			},
			{
				$project: {
					currentUser: 1,
					authorFirstName: "$allBookMarkedAuthor.firstName",
					authorLastName: "$allBookMarkedAuthor.lastName",
					authorAccountId: "$allBookMarkedAuthor.accountId",
					authorImage: "$allBookMarkedAuthor.imageLink",
					authorPublishedStories: "$allBookMarkedAuthor.publishedStories",
				},
			},
			{
				$lookup: {
					from: "stories",
					localField: "authorPublishedStories",
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
				$sort: {
					"story.dateCreated": isLatest ? -1 : 1,
				},
			},
			{
				$facet: {
					currentUser: [
						{
							$project: {
								currentUser: 1,
							},
						},
						{
							$limit: 1,
						},
					],
					allResult: [
						{
							$project: {
								firstName: "$authorFirstName",
								lastName: "$authorLastName",
								accountId: "$authorAccountId",
								imageLink: "$authorImage",
								story: 1,
								isUserLikedThisStory: {
									$cond: {
										if: "$story.likes",
										then: {
											$in: ["$currentUser.accountId", "$story.likes"],
										},
										else: false,
									},
								},
							},
						},
					],
				},
			},
			{
				$project: {
					allResult: {
						$filter: {
							input: "$allResult",
							as: "result",
							cond: {
								$in: [
									"$$result.story.id",
									{
										$first: "$currentUser.currentUser.bookMarks.story",
									},
								],
							},
						},
					},
				},
			},
			{
				$project: {
					totalStories: {
						$size: "$allResult",
					},
					stories: {
						$slice: [
							{
								$filter: {
									input: "$allResult",
									as: "res",
									cond: {
										$regexMatch: {
											input: "$$res.story.title",
											regex: req.body.searched || "",
											options: "i",
										},
									},
								},
							},
							req.body.increment || 5,
						],
					},
				},
			},
		]);

		response.success(res, { ...result });
	} catch (err) {
		response.fail(res, err);
	}
};
