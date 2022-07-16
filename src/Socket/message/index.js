// Actions
const sendMessage = require("../../Controllers/UserActions/sendMessage");
// Variables
const { usersAndTheirJoinedRoom } = require("../globalVariables");
// Helpers
const getUserSocketId = require("../../Helpers/getUserSocketId");

const joinConversation = (io, socket) => {
	socket.on("message-joinConversation", ({ roomId, accountId }) => {
		usersAndTheirJoinedRoom?.push({ room: roomId, accountId, socketId: socket.id });
		socket.join(roomId);
	});
};

const leaveConversation = (io, socket) => {
	socket.on("message-leaveConversation", ({ roomId, accountId }) => {
		const userPosition = usersAndTheirJoinedRoom?.findIndex((e) => e.accountId === accountId);

		if (userPosition > -1) {
			usersAndTheirJoinedRoom.splice(userPosition, 1);
		}

		socket.leave(roomId);
	});
};

const detectUserIsTyping = (io, socket) => {
	socket.on("message-typing", (data) => {
		const receiverSocketId = usersAndTheirJoinedRoom.find(
			(e) => e.accountId === data.to
		)?.socketId;

		io.to(receiverSocketId).emit("message-userIsTyping", {
			from: data.from,
			isTyping: data.isTyping,
		});
	});
};

const sendMessageToConversation = (io, socket) => {
	socket.on(
		"message-sendMessage",
		async ({ text, sender, receiver, roomId, isReplyingTo, media }) => {
			const userSender = usersAndTheirJoinedRoom?.find((e) => e.accountId === sender);
			const userReceiver = usersAndTheirJoinedRoom?.find((e) => e.accountId === receiver);
			const messageObj = {
				text,
				sender,
				receiver,
				isReplyingTo,
				media,
				isReadByReceiver: userSender?.room === userReceiver?.room,
			};

			const { type, data } = await sendMessage(messageObj);

			if (type === "Sent") {
				io.in(roomId).emit("message-messagesSent", data);
				io.to(getUserSocketId(receiver)).emit("notification");
				io.to(userReceiver?.socketId).emit("message-incomingMessage", {
					idReceiver: receiver,
					idSender: sender,
				});
			}
		}
	);
};

const messageInit = (io, socket) => {
	joinConversation(io, socket);
	leaveConversation(io, socket);
	sendMessageToConversation(io, socket);
	detectUserIsTyping(io, socket);
};

module.exports = messageInit;
