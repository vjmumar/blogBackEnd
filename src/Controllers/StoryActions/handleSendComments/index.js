// Models
const Stories = require("../../../Models/stories");

module.exports = async (data) => {
	try {
		await Stories.findOneAndUpdate(
			{ id: data.storyId },
			{
				$addToSet: {
					comments: {
						sender: data.data.sender,
						text: data.data.text,
						commentId: data.data.commentId,
						type: "sent",
					},
				},
			}
		);
		return "Sent";
	} catch (err) {
		return "Fail";
	}
};
