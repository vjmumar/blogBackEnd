// Models
const User = require("../../../Models/user");
const Message = require("../../../Models/message");
// datauri
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
// Helpers
const cloudinary = require("../../../Helpers/cloudinary");
// Random Id Generator
const { uid } = require("uid");
const uniqid = require('uniqid'); 

module.exports = async (obj) => {
	try {
		const { sender, receiver, isSenderInRecieverMessage, isReceiverInSenderMessage } = (
			await User.aggregate([
				{
					$facet: {
						sender: [
							{	
								$match: {
									accountId: obj.sender,
								},
							},
						],
						receiver: [
							{
								$match: {
									accountId: obj.receiver,
								},
							},
						],
					},
				},
				{
					$project: {
						sender: {
							$first: "$sender",
						},
						receiver: {
							$first: "$receiver",
						},
					},
				},
				{
					$project: {
						sender: 1,
						receiver: 1,
						isSenderInRecieverMessage: {
							$cond: {
								if: "$receiver.message.accountId",
								then: {
									$in: ["$sender.accountId", "$receiver.message.accountId"]
								},
								else: false,
							},
						},
						isReceiverInSenderMessage: {
							$cond: {
								if: "$sender.message.accountId",
								then: {
									$in: ["$receiver.accountId", "$sender.message.accountId"],
								},
								else: false,
							},
						},
					},
				},
			])
		)[0];

		// Upload Media
		const media = [];
		if (obj?.media?.length) {
			for (const images of obj.media) {
				const image = parser.format(".jpg", images.file);
				const upload = await cloudinary.uploader(image);
				media.push(upload.url + "+-+" + upload.public_id);
			}
		}

		obj = {
			...obj,
			messageId: `msg-${uid(10)}-${uniqid()}`,
			dateCreated: new Date(),
			media,
		};

		const message = await Message.insertMany(obj);

		await User.bulkWrite([
			{
				updateOne: {
					filter: {
						accountId: sender.accountId,
					},
					update: {
						$addToSet: {
							...(!isReceiverInSenderMessage && {
								message: {
									accountId: receiver.accountId,
									messages: [message[0].messageId],
								},
							}),
							...(isReceiverInSenderMessage && {
								"message.$[e].messages": message[0].messageId,
							}),
						},
					},
					...(isReceiverInSenderMessage && {
						arrayFilters: [
							{
								"e.accountId": receiver.accountId,
							},
						],
					}),
				},
			},
			{
				updateOne: {
					filter: {
						accountId: receiver.accountId,
					},
					update: {
						$addToSet: {
							...(!isSenderInRecieverMessage && {
								message: {
									accountId: sender.accountId,
									messages: [message[0].messageId],
								},
							}),
							...(isSenderInRecieverMessage && {
								"message.$[e].messages": message[0].messageId,
							}),
						},
					},
					...(isSenderInRecieverMessage && {
						arrayFilters: [
							{
								"e.accountId": sender.accountId,
							},
						],
					}),
				},
			},
		]);
		return {
			type: "Sent",
			data: obj,
		};
	} catch (err) {
		return {
			type: "Error",
		};
	}
};
