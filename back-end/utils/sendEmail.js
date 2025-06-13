
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail({ to, subject, html }) {
  const msg = {
    to,
    from: "gerfi97@hotmail.com",  
    subject,
    html,
  };

  await sgMail.send(msg);
}

module.exports = sendEmail;
