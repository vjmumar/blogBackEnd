const Stories = require("../../../Models/stories");
// Helpers
const response = require("../../../Helpers/response");


module.exports = async (req, res) => {
	try {
		const story = await Stories.findOne({ id: req.body.id });
		if (!story) {
			response.fail(res, "Story Not Found");
		}
		response.success(res, story);
	} catch (err) {
		response.fail(req, err);
	}
};
