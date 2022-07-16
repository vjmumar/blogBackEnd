// Actions
const pushFromOnline = require("./pushFromOnline");
const removeFromOnline = require("./removeFromOnline");
const removeFromUserAndRoom = require("./removeFromUserAndRoom");

const connectUser = (io, socket) => {
	socket.on("onlineUserConnect", ({ accountId }) => {
		pushFromOnline(io, socket, accountId);
	});
};

const diconnectUser = (io, socket) => {
	socket.on("disconnect", () => {
		removeFromOnline(io, socket);
		removeFromUserAndRoom(io, socket);
	});
};

const connectAndDisconnectInit = (io, socket) => {
	connectUser(io, socket);
	diconnectUser(io, socket);
};

module.exports = connectAndDisconnectInit;
