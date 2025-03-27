const nodemailer = require('nodemailer');

const sendMail = async function ({ to, subject, message }) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST_DEV,
    port: process.env.EMAIL_PORT_DEV,
    auth: {
      user: process.env.EMAIL_USERNAME_DEV,
      pass: process.env.EMAIL_PASSWORD_DEV,
    },
  });

  const mailOptions = {
    from: `Trackify Bitches <someEmail@gmail.com>`,
    to: to,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
