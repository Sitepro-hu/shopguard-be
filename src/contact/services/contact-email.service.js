const { sendingEmail } = require("../../shared/email-helpers/email");
const {
  createEmailHeader,
  createEmailFooter,
  createContactDetails,
} = require("../../shared/email-helpers/email-sections.helper");

const sendingContactEmail = async (contact) => {
  let html = createEmailHeader({ name: process.env.WEBSITE_NAME });
  html += `<p class="primary">Új megkeresés érkezett a <a href="${process.env.WEBSITE_URL}" target="_blank">${process.env.WEBSITE_NAME}</a> weboldalra!</p>`;
  html += `<p>Név: ${contact.name}<br>`;
  html += `E-mail cím: ${contact.email}<br>`;
  html += `Telefonszám: ${contact.telephone}<br>`;
  html += `Üzenet: ${contact.message}</p>`;
  html += createEmailFooter();

  await sendingEmail({
    subject: `Új megkeresés érkezett`,
    html: html,
    to: process.env.ADMIN_EMAIL,
    replyTo: contact.email,
  });
};

module.exports = {
  sendingContactEmail,
};
