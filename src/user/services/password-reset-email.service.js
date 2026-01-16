const { sendingEmail } = require("../../shared/email-helpers/email");

const sendingPasswordResetEmail = async (user, url) => {
  let html = `
  <p>Kedves ${user.firstname}!</p>
  <p>Az alábbi linkre kattintva tudod visszaállítani a jelszavadat:<br>
  <a href="${url}" target="_blank">Jelszó módosítása</a></p>
  <p><small>Ha nem kérted a jelszavad visszaállítását, akkor kérjük, hagyd figyelmen kívül ezt az e-mailt. A jelszavad nem fog megváltozni, hacsak nem kattintasz a linkre, és nem hozol létre új jelszót.</small></p>
  <p>Üdvözlettel,<br>A(z) ${process.env.WEBSITE_NAME} csapata</p>
  `;

  await sendingEmail({
    subject: `Jelszó visszaállítás`,
    html: html,
    to: user.email,
  });
};

module.exports = {
  sendingPasswordResetEmail,
};
