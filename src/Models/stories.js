const mongoose = require("mongoose");

const STORIES_SCHEMA = new mongoose.Schema({
	dateCreated: {
		required: true,
		type: Date,
		default: new Date(),
	},
	heroLink: String,
	title: String,
	text: String,
	id:  String,
	storyType: String,
	likes: [],
	followers: [],
	comments: [
		{
			sender: String,
			text: String,
			dateCreated: {
				required: true,
				type: Date,
				default: new Date(),
			},
			commentId: String,
		},
	],
});

const model = mongoose.model("Stories", STORIES_SCHEMA);

module.exports = model;
