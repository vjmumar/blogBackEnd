const getStory = require("./get");
const upload = require("./upload");
const edit = require("./edit");
const removeStory = require("./remove");

module.exports = {
	upload: upload,
	edit: edit,
	removeStory: removeStory,
	getStory: getStory,
};
