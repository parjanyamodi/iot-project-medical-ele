const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "siddharthm.ml19@bmsce.ac.in",
    pass: "9900640564@bmsce",
  },
});

const sendMail = async (options) => {
  try {
    const info = await transporter.sendMail({
      from: "siddharthm.ml19@bmsce.ac.in",
      to: options.to,
      subject: "OTP for login",
      text: "OTP is " + options.otp,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports = sendMail;
