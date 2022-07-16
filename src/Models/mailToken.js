const mongoose = require("mongoose");

const TOKEN_SCHEMA = new mongoose.Schema({
    accountId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        expires: 21600,
        default: Date.now
    }
});

const model = mongoose.model("Token", TOKEN_SCHEMA);

module.exports = model;