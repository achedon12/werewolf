import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import path from "path";
import {fromAddress} from "@/utils/publicEmail.js";

dotenv.config({path: path.resolve(process.cwd(), '.env')});

const SMTP_HOST = process.env.SMTP_HOST || "localhost";
const SMTP_PORT = Number(process.env.SMTP_PORT) || (SMTP_HOST === "localhost" ? 1025 : 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

const isSecure = SMTP_PORT === 465 || process.env.SMTP_SECURE === "true";

const transporterConfig = {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: isSecure,
    ...(SMTP_HOST === "localhost" && SMTP_PORT === 1025
        ? {ignoreTLS: true}
        : {requireTLS: SMTP_PORT === 587}),
    tls: {
        rejectUnauthorized: false
    }
};

if (SMTP_USER && SMTP_PASSWORD) {
    transporterConfig.auth = {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
    };
}

const transporter = nodemailer.createTransport(transporterConfig);

export const mailer = async ({to, subject, html}) => {

    const mailOptions = {
        from: `"Support" <${fromAddress}>`,
        to,
        subject,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        if (process.env.NODE_ENV !== "production") {
            console.log("Email envoyé:", info.messageId ?? info);
        }
    } catch (err) {
        console.error("Erreur envoi mail:", err);
        throw err;
    }
};