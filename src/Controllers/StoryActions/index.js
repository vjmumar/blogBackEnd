const handleGetComments = require("./handleGetComments");
const handleSendComment = require("./handleSendComments");
const handleLikeAndUnlikeStory = require("./handleLikeAndUnlikeStory");
const handleBookMarkAndUnBookmarkStory = require("./handleBookMarkAndUnBookmarkStory");

const action = (req, res) => {
	switch (req.body.type) {
		case "getComments":
			handleGetComments(req, res);
			break;
		case "likeAndUnlike":
			handleLikeAndUnlikeStory(req, res);
			break;
		case "bookmarkAndUnBookmark":
			handleBookMarkAndUnBookmarkStory(req, res);
			break;
	}
};

module.exports = {
	action,
	sendComments: handleSendComment,
};
