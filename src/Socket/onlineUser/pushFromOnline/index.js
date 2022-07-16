const { onlineUsers } = require("../../globalVariables");

module.exports = (io, socket, accountId) => {
	// Push New Online User To Array
	const indexOfUser = onlineUsers.findIndex(e => e.accountId === accountId);
	if (indexOfUser === -1) { 
		onlineUsers.push({ socketId: socket.id, accountId });
	} else {
		// Else Replace Socket Id
		onlineUsers[indexOfUser].socketId = socket.id;
	}
	// Then Emit it to Client
	io.emit(
		"onlineUsers",
		onlineUsers.map((e) => e.accountId)
	);
};
