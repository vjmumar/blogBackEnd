const getAllBasicUserData = require("./getAllBasicUserData");
const getCurrentUser = require("./getCurrentUser");
const getDraft = require("./getDraftedStories");
const getPublished = require("./getPublishedStories");
const getBookmarked = require("./getBookmarkedStories");
const getNotification = require("./getNotification");
const getMessageNotification = require("./getMessageNotification");
const getMessage = require("./getMessage");

module.exports = {
	getAllBasicUserData,
	getCurrentUser,
	getDraft,
	getPublished,
	getBookmarked,
	getMessage,
	getNotification,
	getMessageNotification
};
