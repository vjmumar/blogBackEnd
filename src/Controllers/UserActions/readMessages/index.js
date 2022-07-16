// Models
const Messages = require("../../../Models/message");
// Helpers
const response = require("../../../Helpers/response");

module.exports = async (req, res) => {
	try {
		await Messages.updateMany(
			{
				receiver: req.body.currentId,
				sender: req.body.id,
			},
			{
				$set: {
					isReadByReceiver: true,
				},
			}
		);
		
		if (res) {
			response.success(res, []);
		}
	} catch (err) {
		response.fail(res, err);
	}
};
