// Bcrypt and Settings
const bcrypt = require("bcrypt");
const saltRounds = 10;
// Model
const User = require("../../Models/user");
const Token = require("../../Models/mailToken");
// Response
const response = require("../../Helpers/response");
// Request Token
const requestToken = require("../EmailActions/request");
// Random Id Generator
const { uid } = require("uid");
const uniqid = require("uniqid");

const signUp = async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
		const find = await User.findOne({ email: req.body.email.toLowerCase() });

		if (!find) {
			const obj = {
				email: req.body.email.toLowerCase(),
				password: hashedPassword,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				accountId: `account-${uid(10)}-${uniqid()}`,
				imageLink:
					"https://i.pinimg.com/474x/ab/36/bb/ab36bbdac37227ebe06136d900eb87b7.jpg",
			};
			// Insert New User
			await User.create(obj);
			// Then Request New Token And Email It To User 
			req.body.id = obj.accountId;
			req.body.type = "emailVerification";
			await requestToken(req);
			response.success(res, "", []);
		} else {
			response.fail(res, "Email Has Already Been Taken");
		}
	} catch (err) {
		response.fail(res, err);
	}
};

module.exports = signUp;
