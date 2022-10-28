const nodemailer = require("nodemailer");

const sendEmail = (options) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASS,
    },
  });

  // define email options
  const mailOptions = {
    from: "Caleb Mwema <hello@mwema.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send the actual email
  transporter.semdEmail(mailOptions);
};

module.exports = sendEmail;
