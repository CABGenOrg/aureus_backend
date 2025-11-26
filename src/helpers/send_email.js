const nodemailer = require("nodemailer");

async function sendEmail(to, subject, text) {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtps.fiocruz.br",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });
    
    let info = await transporter.sendMail({
      from: '"CABGen" <cabgen@fiocruz.br>',
      to: to,
      subject: subject,
      text: text,
    });

    return { success: true, info };
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return { success: false, error };
  }
}

module.exports = sendEmail;