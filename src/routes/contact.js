const express = require("express");
const router = express.Router();
const sendEmail = require("../helpers/send_email");
const Usuario = require("../models/usuario");

router.post("/", async (req, res) => {
  try {
    const { name, email, institution, subject, message } = req.body;

    const admins = await Usuario.find(
      { estado: "ACTI", tipo: "ADMI" },
      { email: 1 }
    );

    if (!admins || admins.length === 0) {
      return res
        .status(500)
        .json({ ok: false, error: "No administrator found." });
    }

    const adminEmails = admins.map((a) => a.email).join(",");

    const body = `
Nome: ${name}
Email: ${email}
Instituição: ${institution}

Mensagem:
${message}
`;

    const result = await sendEmail(adminEmails, subject, body);

    if (!result.success) {
      return res
        .status(500)
        .json({ ok: false, error: "Failed to send email." });
    }

    res.json({ ok: true, message: "Email sent successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Internal server error!" });
  }
});

module.exports = router;
