const { onlineUsers } = require("../../globalVariables");

module.exports = (io, socket, accountId) => {
	// Remove From Online Users Array
	const disconnectedUserPosition = onlineUsers.findIndex((e) => e.socketId === socket.id);
	if (disconnectedUserPosition > -1) {
		// Remove Disconnected User from Array
		onlineUsers.splice(disconnectedUserPosition, 1);
		// Then Emit The Updated Array To Client
		io.emit(
			"onlineUsers",
			onlineUsers.map((e) => e.accountId)
		);
	}
};
