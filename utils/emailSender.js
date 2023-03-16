const nodemailer = require("nodemailer");

module.exports = async (email, passwordResetCode) => {
  try {
    return new Promise((resolve, reject) => {
      let isSent = false;

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `GOODNEWS NIGERIA`,
        html: `
                  <h2> PASSWORD RESET CODE FROM GOODNEWS NIGERIA </h2>
                  <p>Your password reset code is ${passwordResetCode}</p>
                `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          isSent = false;
          resolve(false);
          //   return false;
        } else {
          isSent = true;
          resolve(true);
          //   return true;
        }
      });
    });
  } catch (error) {
    return false;
  }
};
