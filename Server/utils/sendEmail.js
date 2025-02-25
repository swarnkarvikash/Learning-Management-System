import nodemailer from "nodemailer";

const sendEmail = async function (email, subject, message){

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USERNAME, // Your email (Use .env for security)
          pass: process.env.SMTP_PASSWORD, // App password (not your regular password)
        },
      });
      
      // Function to send email

      await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL,
        to: email,
        subjects: subject,
        html: message,
      });

};

export default sendEmail;