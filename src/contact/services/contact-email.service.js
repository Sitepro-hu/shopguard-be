const { sendingEmail } = require("../../shared/email-helpers/email");
const {
  createEmailHeader,
  createEmailFooter,
  createContactDetails,
} = require("../../shared/email-helpers/email-sections.helper");

const sendingContactEmail = async (contact) => {
  let html = createEmailHeader({ name: process.env.WEBSITE_NAME });
  html += `<p class="primary">A new message has been received on the <a href="${process.env.WEBSITE_URL}" target="_blank">${process.env.WEBSITE_NAME}</a> website!</p>`;
  html += `<p>Name: ${contact.name}<br>`;
  html += `Email: ${contact.email}<br>`;
  html += `Telephone: ${contact.telephone}<br>`;
  html += `Country: ${contact.country}<br>`;
  html += `Message: ${contact.message}</p>`;
  html += createEmailFooter();

  await sendingEmail({
    subject: `A new message has been received`,
    html: html,
    to: process.env.ADMIN_EMAIL,
    replyTo: contact.email,
  });
};

module.exports = {
  sendingContactEmail,
};
