import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // ou use "smtp" se tiver outro provedor
  auth: {
    user: process.env.EMAIL_USER, // seu e-mail
    pass: process.env.EMAIL_PASS, // senha de app ou token (não a senha real)
  },
});
