// Require the Cloudinary library
const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
	secure: true,
});

const uploader = (image) => {
	const promise = new Promise(async (res, rej) => {
		const result = await cloudinary.uploader.upload(image.content, { folder: "HadesBlog" });
		if (result) {
			res(result);
		} else {
			rej();
		}
	});

	return promise;
};

const destroy = (image) => {
	const promise = new Promise((res, rej) => {
		const result = (await = cloudinary.uploader.destroy(image));
		if (result) {
			res(result);
		} else {
			rej();
		}
	});
	return promise;
};

module.exports = {
	uploader: uploader,
	destroy: destroy,
};
