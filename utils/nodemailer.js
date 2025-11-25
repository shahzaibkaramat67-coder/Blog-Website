import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

const sendMail = async ({ to, subject, text, html, from }) => {
  if (!to) {
    console.error("Recipient email is missing");
    return false;
  }

  try {
    await transporter.sendMail({
      from: from || `Your Website <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });
    console.log(`Email sent to ${to} successfully.`);
    return true; // indicates email was sent
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err);
    return false; // indicates email failed
  }
};

export default sendMail;
