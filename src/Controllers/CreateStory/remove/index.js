const User = require("../../../Models/user");
const Stories = require("../../../Models/stories");
// Helpers
const response = require("../../../Helpers/response");
const cloudinary = require("../../../Helpers/cloudinary");

module.exports = async (req, res) => {
	try {
		const story = await Stories.findOne({ id: req.body.id }).select("heroLink");
		const storyType = req.body.type === "draft-stories" ? "draftedStories" : "publishedStories";

		// Remove Story if it Exist On Cloudinary
		if (story.heroLink) {
			await cloudinary.destroy(story.heroLink.split("+-+")[1]);
		}

		// Remove Story From User
		await User.findByIdAndUpdate(req.id, {
			$pull: {
				[storyType]: req.body.id,
			},
		});

		// Finally Delete The Story From Collecion
		await Stories.findOneAndRemove({ id: req.body.id });

		response.success(res, "Removed");
	} catch (err) {
		response.fail(res, err);
	}
};
