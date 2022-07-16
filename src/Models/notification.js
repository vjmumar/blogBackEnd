const mongoose = require('mongoose');

const NOTIFICATION_SCHEMA = new mongoose.Schema({
    to: {
        required: true,
        type: String,
    },
    from: {
        required: true,
        type: String,
    },
    message: {
        required: true,
        type: String,
    },
    dateCreated: {
        type: Date,
        default: new Date()
    },
    notificationId: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

const model = mongoose.model("Notification", NOTIFICATION_SCHEMA);

module.exports = model;