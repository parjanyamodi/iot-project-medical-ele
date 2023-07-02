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

const sendAlert = async (data, options) => {
  try {
    console.log(options);
    options.to.map(async (t) => {
      if (t !== "") {
        const info = await transporter.sendMail({
          from: "siddharthm.ml19@bmsce.ac.in",
          to: t,
          subject: "Alert for device - " + data.deviceID,
          text: JSON.stringify(data),
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

sendAlert;
module.exports = sendAlert;
