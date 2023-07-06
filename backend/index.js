const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const otpMailer = require("./mailer");

const sendAlert = require("./alert");

// Express requirements
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 100000000,
    extended: true,
  })
);
// CORS setup
app.use(
  cors({
    origin: "*",
  })
);

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://admin:fWXO02Azq0KzH59M@cluster0.rpynoi7.mongodb.net/")
  .then(() => {
    console.log("Connected to DB");
  });

// Create a new user model
const Log = mongoose.model(
  "Log",
  new mongoose.Schema(
    {
      heartRate: Number,
      temperature: String,
      humidity: String,
      co2: Number,
      deviceID: String,
      color: String,
    },
    { timestamps: true }
  )
);

// Create a new user model
const Device = mongoose.model(
  "Device",
  new mongoose.Schema({
    deviceID: { type: String, unique: true },
    attenderName: String,
    attenderEmail: String,
    doctorName: String,
    doctorEmail: String,
    age: Number,
    motherName: String,
  })
);
function isNumber(value) {
  return typeof value === "number" && isFinite(value);
}
// Create a POST route to insert data into MongoDB
app.post("/api/log", async (req, res) => {
  console.log(req.body);
  try {
    // Get the post data from the request
    const data = {
      heartRate: req.body.heartRate,
      temperature: req.body.dht.temperature,
      humidity: req.body.dht.humidity,
      co2: req.body.co2,
      deviceID: req.body.deviceID,
      color:
        req.body.color.red < req.body.color.blue &&
        req.body.color.red < req.body.color.green
          ? "R"
          : req.body.color.blue < req.body.color.red &&
            req.body.color.blue < req.body.color.green
          ? "B"
          : req.body.color.green < req.body.color.red &&
            req.body.color.green < req.body.color.blue
          ? "G"
          : "",
    };
    const device = await Device.findOneAndUpdate(
      { deviceID: data.deviceID },
      { deviceID: data.deviceID },
      { upsert: true, new: true }
    );

    // Create a new user object
    const log = new Log(data);

    // Save the user to MongoDB
    const logInserted = await log.save();

    var shouldSend = false;
    console.log(device);
    if (data.temperature < 29 || data.temperature > 38) {
      shouldSend = true;
    }
    if (data.humidity < 65 || data.humidity > 90) {
      shouldSend = true;
    }
    if (data.color === "B" || data.color === "G") {
      shouldSend = true;
    }

    if (shouldSend) {
      var to = ["siddharthm.ml19@bmsce.ac.in"];
      if (
        device.doctorEmail ||
        device.doctorEmail !== "" ||
        device.doctorEmail != null
      ) {
        to.push(device.doctorEmail);
      }
      if (
        device.attenderEmail ||
        device.attenderEmail !== "" ||
        device.attenderEmail != null
      ) {
        to.push(device.attenderEmail);
      }
      sendAlert(data, { to });
    }
    res.status(200).json({
      inserted: true,
      data: logInserted,
    });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

app.post("/api/update", async (req, res) => {
  try {
    const data = {
      deviceID: req.body.deviceID,
      attenderName: req.body.attenderName,
      attenderEmail: req.body.attenderEmail,
      doctorName: req.body.doctorName,
      doctorEmail: req.body.doctorEmail,
      age: req.body.age,
      motherName: req.body.motherName,
    };
    // Create a new user object

    const device = await Device.findOneAndUpdate(
      { deviceID: data.deviceID },
      data,
      { upsert: true, new: true }
    );
    res.status(200).json({
      inserted: true,
      data: device,
    });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

app.get("/api/device", async (req, res) => {
  try {
    const devices = await Device.find();
    res.status(200).json({ status: 200, data: devices });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});
app.post("/api/get-details", async (req, res) => {
  try {
    const device = await Device.findOne({ deviceID: req.body.deviceID });
    res.status(200).json({ status: 200, data: device });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});
app.post("/api/get-otp", async (req, res) => {
  try {
    const emails = await Device.find();
    const allEmails = [];
    emails.map(async (obj) => {
      allEmails.push(obj.attenderEmail);
      allEmails.push(obj.doctorEmail);
    });
    const condition = allEmails.includes(req.body.email) ? true : false;
    if (condition) {
      const otp = Math.floor(1000 + Math.random() * 9000);
      otpMailer({ to: req.body.email, otp });
      res.status(200).json({ status: 200, data: "OTP Sent", otp });
    } else {
      res.status(200).json({ status: 401, data: "User not found" });
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/api/get-data", async (req, res) => {
  try {
    const logs = await Log.find({ deviceID: req.body.deviceID }).sort({
      createdAt: 1,
    });
    const co2 = [];
    const heartRate = [];
    const temperature = [];
    const color = [];
    const humidity = [];
    const updatedAt = [];
    logs.map((log) => {
      co2.push(log.co2);
      heartRate.push(log.heartRate);
      temperature.push(log.temperature);
      color.push(log.color);
      humidity.push(log.humidity);
      updatedAt.push(log.updatedAt);
    });
    const data = {
      co2,
      heartRate,
      temperature,
      color,
      humidity,
      updatedAt,
    };

    res.status(200).json({ status: 200, data });
  } catch (err) {
    console.log(err);
  }
});
app.post("/api/get-last-data", async (req, res) => {
  try {
    const logs = await Log.find({ deviceID: req.body.deviceID }).sort({
      createdAt: -1,
    });

    res.status(200).json({ status: 200, logs: [logs[0]] });
  } catch (err) {
    console.log(err);
  }
});
// Start the server
app.listen(4500, () => console.log("Server started on port 3000"));
