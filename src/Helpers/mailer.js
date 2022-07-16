const nodemailer = require("nodemailer");

//dotenv
require("dotenv/config");

const sendEmail = async ({ email, firstName,accountId, type, token }) => {
	const transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: process.env.GMAIL_EMAIL,
			pass: process.env.GMAIL_PASSWORD,
		},
		secure: true
	});

	let page;
	let subject;
	let message;
	let buttonMessage;

	if (type === "emailVerification") {
		page = process.env.EMAIL_VERIFICATION_PAGE;
		subject = "Email Verification";
		message = "Please Click The Button To Verify And Activate Your Account";
		buttonMessage = "Verify"
	} else if (type === "changePassword") {
		page =  process.env.CHANGE_PASSWORD_PAGE;
		subject = "Change Password";
		message = "Please Click The Button To Change Your Password";
		buttonMessage = "Change Password";
	}

	try {
		await transporter.sendMail({
			from: "Hades Blog 👌",
			to: email,
			subject,
			html: `
			<table
			style="max-width: 400px;margin: 0;background: black;min-width: 400px;display: flex;flex-direction: column;align-items: center;justify-content: center;outline: 2px solid white;outline-offset: -13px;outline-style: dashed;">
			<div style="border: 2px dashed white;height: 100%;margin: 10px;">
				<p style="text-align:center;font-size:35px;color:white;width: 90%;
				margin: 55px auto 0px;">Hello ${firstName}!</p>
				<p style="font-size:19px;color:white;text-align:center;width: 90%;margin: 0px auto 15px;">${message}</p>
				<p style="text-align: center;margin-top:0;color:white;font-style:italic">~This Token Will Expire After 6hours,Do Not Reply!~
				</p>
				<a href="${page}?id=${accountId}&token=${token}"
					style="width:fit-content;text-decoration: none;border:none;padding:10px 75px;background:white;color:black;border-radius:20px;margin: auto;display: block;margin-bottom: 55px;">${buttonMessage}</a>
			</div>
		</table>
        `,
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports = sendEmail;
