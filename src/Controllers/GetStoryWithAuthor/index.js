const User = require("../../Models/user");
//Helper
const response = require("../../Helpers/response");

const handleGetStoryWithAuthor = async (req, res) => {
	try {
		const result = await User.aggregate([
			{
				$facet: {
					currentUser: [
						{
							$match: {
								accountId: req.body.currentId,
							},
						},
					],
					user: [
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
					user: {
						$first: "$user",
					},
				},
			},
			{
				$project: {
					firstName: "$user.firstName",
					lastName: "$user.lastName",
					imageLink: "$user.imageLink",
					publishedStories: "$user.publishedStories",
					accountId: "$user.accountId",
					bookMarks: "$user.bookMarks",
					currentUser: 1,
					providedStory: {
						$cond: {
							if: {
								$in: [req.body.story, "$user.publishedStories"],
							},
							then: req.body.story,
							else: false,
						},
					},
				},
			},
			{
				$lookup: {
					from: "stories",
					localField: "providedStory",
					foreignField: "id",
					as: "story",
				},
			},
			{
				$project: {
					authorFirstName: "$firstName",
					authorLastName: "$lastName",
					authorAccountId: "$accountId",
					authorImage: "$imageLink",
					providedStory: 1,
					doesUserBookmarkedThisStory: {
						$cond: {
							if: "$currentUser.bookMarks",
							then: {
								$in: [req.body.story, "$currentUser.bookMarks.story"],
							},
							else: false,
						},
					},
					doesUserLikedThisStory: {
						$cond: {
							if: {
								$first: "$story.likes",
							},
							then: {
								$in: [
									"$currentUser.accountId",
									{
										$first: "$story.likes",
									},
								],
							},
							else: false,
						},
					},
					story: {
						$first: "$story",
					},
				},
			},
		]);

		if (result.length && result[0]?.providedStory) {
			response.success(res, { ...result });
		} else {
			response.fail(res, "Story / User Not Found");
		}
	} catch (err) {
		response.fail(res, "Back-end Error");
	}
};

module.exports = handleGetStoryWithAuthor;
