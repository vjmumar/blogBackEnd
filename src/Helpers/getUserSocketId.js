const { onlineUsers } = require("../Socket/globalVariables");

const getUserSocketId = (accountId) => {
	return onlineUsers.find((e) => e.accountId === accountId)?.socketId;
};

module.exports = getUserSocketId;