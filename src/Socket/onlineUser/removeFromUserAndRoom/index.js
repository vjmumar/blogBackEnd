const { usersAndTheirJoinedRoom } = require("../../globalVariables");

module.exports = (io, socket) => {
	const disconnectedUserPositionInArray = usersAndTheirJoinedRoom?.findIndex(
		(e) => e.socketId === socket.id
	);
	if (disconnectedUserPositionInArray > -1) {
		// Remove From usersAndTheirJoinedRoom Array
		usersAndTheirJoinedRoom.splice(disconnectedUserPositionInArray, 1);
	}
};
