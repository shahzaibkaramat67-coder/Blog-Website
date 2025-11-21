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

const sendMail = async ({ to, subject, text, html }) => {
  if (!to) throw new Error("Recipient email is required");

  return await transporter.sendMail({
    from: `Your Website <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html
  });
};

export default sendMail;
