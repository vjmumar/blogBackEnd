// Models
const User = require("../../../Models/user");
const Message = require("../../../Models/message");
// Helpers
const response = require("../../../Helpers/response");
// Helpers
const cloudinary = require("../../../Helpers/cloudinary");

module.exports = async (req, res) => {
	try {
		const {
			isNotRemovedBySenderOrReceiver,
			isRemovedBySenderOrReceiver,
			isRemovedBySenderOrReceiverMedias,
		} = (
			await User.aggregate([
				{
					$match: {
						$expr: {
							$eq: ["$_id", { $toObjectId: req.id }],
						},
					},
				},
				{
					$project: {
						accountId: 1,
						messagesFromReceiver: {
							$first: {
								$filter: {
									input: "$message",
									as: "msg",
									cond: {
										$eq: ["$$msg.accountId", req.body.selectedUser],
									},
								},
							},
						},
					},
				},
				{
					$lookup: {
						from: "messages",
						localField: "messagesFromReceiver.messages",
						foreignField: "messageId",
						as: "message",
					},
				},
				{
					$project: {
						isNotRemovedBySenderOrReceiver: {
							$filter: {
								input: "$message",
								as: "msg",
								cond: {
									$eq: ["$$msg.isRemovedBySenderOrReceiver", false],
								},
							},
						},
						isRemovedBySenderOrReceiver: {
							$filter: {
								input: "$message",
								as: "msg",
								cond: {
									$eq: ["$$msg.isRemovedBySenderOrReceiver", true],
								},
							},
						},
					},
				},
				{
					$project: {
						isNotRemovedBySenderOrReceiver: "$isNotRemovedBySenderOrReceiver.messageId",
						isRemovedBySenderOrReceiver: "$isRemovedBySenderOrReceiver.messageId",
						isRemovedBySenderOrReceiverMedias: {
							$reduce: {
								input: "$isRemovedBySenderOrReceiver",
								initialValue: [],
								in: {
									$concatArrays: ["$$this.media", "$$value"],
								},
							},
						},
					},
				},
			])
		)[0];

		// Remove All Removed By Sender or Receiver Medias To Cloudinary
		if (isRemovedBySenderOrReceiverMedias?.length) {
			for (const media of isRemovedBySenderOrReceiverMedias) {
				await cloudinary.destroy(media.split("+-+")[1]);
			}
		}

		// Delete All Message That Is Removed By Sender Or Receiver From Db
		await Message.deleteMany({ messageId: { $in: isRemovedBySenderOrReceiver } });
		// And Update All Message That Is Not Removed By Sneder Or Receiver to True
		await Message.updateMany(
			{
				messageId: {
					$in: isNotRemovedBySenderOrReceiver,
				},
			},
			{ $set: { isRemovedBySenderOrReceiver: true } }
		);

		// Then Here Remove All Message From Receiver
		await User.findByIdAndUpdate(
			req.id,
			{
				$set: {
					"message.$[e].messages": [],
				},
			},
			{
				arrayFilters: [
					{
						"e.accountId": req.body.selectedUser,
					},
				],
			}
		);
		response.success(res, []);
	} catch (err) {
		throw err;
		response.fail(req, err);
	}
};
