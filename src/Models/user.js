const mongoose = require("mongoose");

const USER_SCHEMA = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	accountId: {
		type: String
	},
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	imageLink: {
		type: String,
		required: false,
	},
	aboutMe: {
		type: String,
		default: "I am Very Cool",
		required: false,
	},
	dateCreated: {
		type: Date,
		default: new Date(),
	},
	verified: {
		type: Boolean,
		required: true,
		default: false,
	},
	followers: [],
	followingAccount: [],
	friends: [],
	friendRequest: [],
	myFriendRequest: [],
	draftedStories: [],
	publishedStories: [],
	notification: [],
	bookMarks: [
		{
			author: {
				type: String,
				required: true
			},
			story: {
				type: String,
				required: true
			}
		}
	], 
	message: [
		{
			accountId: String,
			messages: [],
		},
	],
});

const model = mongoose.model("User", USER_SCHEMA);

module.exports = model;
