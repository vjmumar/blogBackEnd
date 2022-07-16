const User = require("../../../Models/user");
const Stories = require("../../../Models/stories");
// Helpers
const response = require("../../../Helpers/response");
const cloudinary = require("../../../Helpers/cloudinary");
// datauri
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
// Random Id Generator
const { uid } = require("uid");
const uniqid = require('uniqid'); 

module.exports = async (req, res) => {
	try {
		// File
		const file = req.file;
		const image = file ? parser.format(".jpg", file.buffer) : "";
		const upload = file ? await cloudinary.uploader(image) : "";

		// StoryType
		const storyType = req.body.type === "draft" ? "draftedStories" : "publishedStories";

		// Random Id
		const id = `story-${uid(10)}-${uniqid()}`;

		// Update User And Create New Story
		await Stories.create({
			heroLink: file ? upload.url + "+-+" + upload.public_id : "",
			title: req.body.title,
			id,
			text: req.body.text,
			storyType: req.body.type,
		});

		// Finally Push Story To User
		await User.findByIdAndUpdate(req.id, {
			$addToSet: {
				[storyType]: id,
			},
		});

		response.success(res, []);
	} catch (err) {
		response.fail(res, err);
	}
};
