import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "localhost",
    port: Number(process.env.MAILHOG_SMTP_PORT),
    ignoreTLS: true
});

export const mailer = async ({ to, subject, html }) => {
    const mailOptions = {
        from: '"Support" contact@werewolf.app',
        to,
        subject,
        html
    };
    await transporter.sendMail(mailOptions);
};