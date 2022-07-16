//Uid
const { uid } = require("uid");
//Send Comment Function
const { sendComments } = require("../../Controllers/StoryActions");

const joinStory = (io, socket) => {
	socket.on("story-join", ({ roomId }) => {
		socket.join(roomId);
	});
};

const leaveStory = (io, socket) => {
	socket.on("story-leave", ({ roomId }) => {
		socket.leave(roomId);
	});
};

const sendComment = (io, socket) => {
	//Send Comment
	socket.on("story-sendComment", async (data) => {
		const obj = {
			senderFirstName: data.senderFirstName,
			senderLastName: data.senderLastName,
			senderImage: data.senderImage,
			storyId: data.storyId,
			data: {
				sender: data.sender,
				text: data.text,
				commentId: `comment-${uid(10)}`,
				dateCreated: new Date(),
			},
		};

		const sendToDb = await sendComments(obj);

		if (sendToDb === "Sent") {
			io.in(data.storyId).emit("story-commentSent", obj);
		}
	});
};

const readStoryInit = (io, socket) => {
	joinStory(io, socket);
	leaveStory(io, socket);
	sendComment(io, socket);
};

module.exports = readStoryInit;
