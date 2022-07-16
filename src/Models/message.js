const mongoose = require("mongoose");

const MESSAGE_SCHEMA = new mongoose.Schema({
	sender: {
		require: true,
		type: String,
	},
	receiver: {
		require: true,
		type: String,
	},
	dateCreated: {
		required: false,
		default: new Date(),
		type: Date,
	},
	isReplyingTo: {
		type: String,
		default: "",
		required: false,
	},
    text: {
        type: String,
        default: ""
    },
	messageId: {
		type: String,
		unique: true,
	},
	media: {
		type: Array,
		default: [],
	},
	isReadByReceiver: {
		type: Boolean,
		default: false,
	},
	isRemovedBySenderOrReceiver: {
		type: Boolean,
		default: false,
	},
});

const model = mongoose.model("Message", MESSAGE_SCHEMA);
module.exports = model;
