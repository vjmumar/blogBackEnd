// Models
const User = require("../../../Models/user");
// Cloudinary
const cloudinary = require("../../../Helpers/cloudinary");
// Helpers
const response = require("../../../Helpers/response");
// Parser
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();

module.exports = async (req, res) => {
	try {
		let { imageLink } = await User.findById(req.id).select("imageLink");
		let newImage;

		if (req.file) {
			const image = parser.format(".jpg", req.file.buffer);
			const upload = await cloudinary.uploader(image);
			imageLink && (await cloudinary.destroy(imageLink.split("+-+")[1]));
			newImage = upload.url + "+-+" + upload.public_id;
		}

		await User.findByIdAndUpdate(req.id, {
			$set: {
				...(req.file && { imageLink: newImage }),
				aboutMe: req.body.profileDescription,
			},
		});

		response.success(res, []);
	} catch (err) {
		response.fail(res, []);
	}
};
