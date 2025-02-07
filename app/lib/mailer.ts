import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, html: string) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // Utilise la sécurité (SSL/TLS) si nécessaire
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Avenue Mondaine" <no-reply@avenuemondaine.com>`, // Adresse expéditeur
    to: to, // Destinataire
    subject: subject, // Sujet de l'email
    html: html, // Contenu HTML au lieu de texte
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};
