import nodemailer from 'nodemailer';

const sendMail = async ({ to, subject, text, html }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        ort: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });

    return await transporter.sendMail({
        from: `Your Website <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
    });
};

export default sendMail;
