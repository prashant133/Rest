const sgMail = require("@sendgrid/mail");
const ApiError = require("./ApiError");
const asyncHandler = require("./asyncHandler");
const nodemailer = require("nodemailer");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const soap = require("soap");

const sendEmail = asyncHandler(async ({ to, subject, text, html }) => {
  try {
    const msg = {
      to,
      from: {
        email: process.env.SENDGRID_VERIFIED_SENDER,
        name: "Yankee's App",
      },
      subject,
      text: text || subject,
      html: html || text || subject,
    };

    const response = await sgMail.send(msg);
    console.log("Email sent successfully:", response[0].headers);
    return true;
  } catch (error) {
    console.error("SendGrid Error:", {
      message: error.message,
      response: error.response?.body,
      stack: error.stack,
    });
    throw new ApiError(500, `Email sending failed: ${error.message}`);
  }
});


module.exports = sendEmail;
