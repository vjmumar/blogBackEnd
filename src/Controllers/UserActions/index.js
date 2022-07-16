// Actions
const editInformation = require("./editInformation");
const requestToBeFriend = require("./requestToBeFriend");
const cancelRequestToBeFriend = require("./cancelRequestToBeFriend");
const acceptUserFriendRequest = require("./acceptUserFriendRequest");
const rejectUserFriendRequest = require("./rejectUserFriendRequest");
const unfriendUser = require("./unfriendUser");
const follow = require("./follow");
const unfollow = require("./unfollow");
const readNotifications = require("./readNotifications");
const readMessages = require("./readMessages");
const sendMessage = require("./sendMessage");
const clearSelectedUserMessages = require("./clearSelectedUserMessages");
const clearNotifications = require("./clearNotifications");

const action = (req, res) => {
	switch (req.body.type) {
		case "follow":
			follow(req, res);
			break;
		case "unfollow":
			unfollow(req, res);
			break;
		case "editInformation":
			editInformation(req, res);
			break;
		case "requestToBeFriend":
			requestToBeFriend(req, res);
			break;
		case "cancelRequestToBeFriend":
			cancelRequestToBeFriend(req, res);
			break;
		case "rejectUserFriendRequest":
			rejectUserFriendRequest(req, res);
			break;
		case "acceptUserFriendRequest":
			acceptUserFriendRequest(req, res);
			break;
		case "unfriendUser":
			unfriendUser(req, res);
			break;
		case "readNotifications":
			readNotifications(req, res);
			break;
		case "sendMessage":
			sendMessage();
			break;
		case "readMessage":
			readMessages(req, res);
			break;
		case "clearSelectedUserMessages":
			clearSelectedUserMessages(req, res);
			break;
		case "clearNotifications":
			clearNotifications(req, res);
			break;
	}
};

module.exports = {
	action: action,
	sendMessage: sendMessage,
};
