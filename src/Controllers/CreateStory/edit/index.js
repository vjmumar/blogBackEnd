const User = require("../../../Models/user");
const Stories = require("../../../Models/stories");
// Helpers
const response = require("../../../Helpers/response");
const cloudinary = require("../../../Helpers/cloudinary");
// datauri
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();

module.exports = async (req, res) => {
	try {
		const { heroLink, storyType } = await Stories.findOne({ id: req.body.id }).select(
			"heroLink storyType"
		);

		const type = req.body.type;
		const isTypePublished = type === "published";

		// File
		const file = req.file;
		let newImage;

		if (file) {
			// Destroy Old Image From Cloudinary If There was an image
			heroLink && (await cloudinary.destroy(heroLink.split("+-+")[1]));
			// Then Upload The New One
			const image = parser.format(".jpg", file.buffer);
			const upload = await cloudinary.uploader(image);
			// Then Assign url To New Image Variable
			newImage = upload.url + "+-+" + upload.public_id;
		} else {
			newImage = heroLink;
		}

		// Check if type is not equals to story type
		// Then Update User
		if (type !== storyType) {
			await User.findByIdAndUpdate(req.id, {
				$pull: {
					[storyType === "published" ? "publishedStories" : "draftedStories"]:
						req.body.id,
				},
				$addToSet: {
					[isTypePublished ? "publishedStories" : "draftedStories"]: req.body.id,
				},
			});
		}

		// Update Story
		await Stories.findOneAndUpdate(
			{ id: req.body.id },
			{
				$set: {
					title: req.body.title,
					text: req.body.text,
					dateCreated: new Date(),
					heroLink: newImage,
					storyType: isTypePublished ? "published" : "draft",
				},
			}
		);

		response.success(res, []);
	} catch (err) {
		response.fail(res, err);
	}
};
