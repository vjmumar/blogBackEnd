const User = require("../../Models/user");
// Helpers
const response = require("../../Helpers/response");
// Actions
const emailTokenVerify = require("../EmailActions/verify");

const emailVerification = async (req, res) => {
	try {
        const verify = await emailTokenVerify(req);
        if (verify === "Success") {
            await User.findOneAndUpdate({ accountId: req.body.id}, {
                $set: {
                    verified: true
                }
            });
            response.success(res,[]);
        } else {
            response.fail(res, verify);
        }
	} catch (err) {
        response.fail(req,err);
    }
};

module.exports = emailVerification
