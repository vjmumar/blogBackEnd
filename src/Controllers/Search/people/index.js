// Models
const User = require("../../../Models/user");
//Helpers
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		const result = await User.aggregate([
			{
				$facet: {
					allResult: [
						{
							$match: {
								accountId: {
									$ne: req.body.accountId || "",
								},
								verified: true,
								$expr: {
									$regexMatch: {
										input: {
											$concat: ["$firstName", " ", "$lastName"],
										},
										regex: req.body.searched || "",
										options: "ix",
									}
								},
							},
						},
					],
					filteredResult: [
						{
							$match: {
								accountId: {
									$ne: req.body.accountId || "",
								},
								verified: true,
								$expr: {
									$regexMatch: {
										input: {
											$concat: ["$firstName", " ", "$lastName"],
										},
										regex: req.body.searched || "",
										options: "ix",
									},
								},
							},
						},
						{
							$project: {
								accountId: 1,
								firstName: 1,
								lastName: 1,
								imageLink: 1,
								aboutMe: 1,
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
					result: "$filteredResult",
					totalResult: {
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
