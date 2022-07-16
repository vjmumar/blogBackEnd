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
								accountId: 1,
								firstName: 1,
								lastName: 1,
								imageLink: 1,
								aboutMe: 1,
								followingAccount: 1,
							},
						},
					],
					currentUser: [
						{
							$match: {
								accountId: req.body.id,
							},
						},
						{
							$project: {
								accountId: 1,
								firstName: 1,
								lastName: 1,
								imageLink: 1,
								aboutMe: 1,
								followingAccount: 1,
							},
						},
					],
				},
			},
			{
				$project: {
					filteredResult: {
						$filter: {
							input: "$allUser",
							as: "user",
							cond: {
								$and: [
									{
										$in: [
											"$$user._id",
											{
												$first: "$currentUser.followingAccount",
											},
										],
									},
									{
										$regexMatch: {
											input: {
												$concat: [
													"$$user.firstName",
													" ",
													"$$user.lastName",
												],
											},
											regex: req.body.search || "",
											options: "ix",
										},
									},
								],
							},
						},
					},
					totalFollowedUsers: {
						$size: {
							$first: "$currentUser.followingAccount",
						},
					},
				},
			},
			{
				$project: {
					data: {
						$slice: ["$filteredResult", 0, req.body.increment || 5],
					},
					totalFollowedUsers: "$totalFollowedUsers",
				},
			},
		]);

		response.success(res, { ...result });
	} catch (err) {
		response.fail(res, err);
	}
};
