const nodemailer = require("nodemailer");

async function sendingEmail({
  subject,
  html,
  to = process.env.ADMIN_EMAIL,
  replyTo = process.env.EMAIL_FROM,
}) {
  const mailOptions = {
    from: `${process.env.WEBSITE_NAME} <${process.env.EMAIL_FROM}>`,
    to: to,
    subject: subject,
    html: html,
    replyTo: replyTo,
  };
  await createTransport().sendMail(mailOptions);
}

function createTransport() {
  // Ha megadva az egész URL (pl. szolgáltatótól), azt használjuk – a felhasználónévben @ → %40
  const connectionUrl = process.env.EMAIL_URL;
  if (connectionUrl) {
    return nodemailer.createTransport(connectionUrl);
  }

  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: {
      user: process.env.EMAIL_USER || process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PSW,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

module.exports = {
  sendingEmail,
};
