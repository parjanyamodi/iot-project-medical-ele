import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import constants from "../constants.json";
import HeartRate from "./heartRate";
import CO2 from "./co2";
import Temp from "./temp";
const Dashboard = (props) => {
  const [deviceDetails, setDeviceDetails] = useState({});
  const [latestStats, setLatestStats] = useState({});
  const [historicalStats, setHistoricalStats] = useState({
    heartRate: [],
    updatedAt: [],
    createdAt: [],
    co2: [],
    temperature: [],
    humidity: [],
  });
  const [searchParams] = useSearchParams();
  useEffect(() => {
    getDeviceDetials();
    getLatestStat();
    historicalStat();
  }, []);
  const getDeviceDetials = () => {
    fetch(constants.baseUrl + "/get-details", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        deviceID: searchParams.get("deviceID"),
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setDeviceDetails(data.data);
      });
  };
  const getLatestStat = () => {
    fetch(constants.baseUrl + "/get-last-data", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        deviceID: searchParams.get("deviceID"),
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.logs[0]) {
          setLatestStats(data.logs[0]);
        } else {
          alert("No Data Found");
        }
      });
  };
  const historicalStat = () => {
    fetch(constants.baseUrl + "/get-data", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        deviceID: searchParams.get("deviceID"),
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setHistoricalStats(data.data);
      });
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center mt-5">
        <div className="col-12">
          <h1>MedCloud</h1>
        </div>
      </div>
      <div className="row justify-content-start back-btn mb-5">
        <div className="col-12">
          <button
            className="btn btn-danger"
            onClick={(e) => window.location.replace("/")}
          >
            Back
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div class="alert alert-primary">
            <h2>{deviceDetails.deviceID}</h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 col-12 mt-3">
          <div className="card card-device-details">
            <div className="card-body">
              <p>
                <strong>Doctor's Name: </strong>
                {deviceDetails.doctorName}
              </p>
              <p>
                <strong>Doctor's Email: </strong>
                {deviceDetails.doctorEmail}
              </p>
              <p>
                <strong>Attender's Name: </strong>
                {deviceDetails.attenderName}
              </p>
              <p>
                <strong>Attender's Email: </strong>
                {deviceDetails.attenderEmail}
              </p>
              <p>
                <strong>Age: </strong>
                {deviceDetails.age} Days
              </p>
              <p>
                <strong>Mother's Name: </strong>
                {deviceDetails.motherName}
              </p>
              <button
                className="btn btn-outline-danger"
                onClick={(e) =>
                  window.location.replace(
                    "/update-device?deviceID=" + deviceDetails.deviceID
                  )
                }
              >
                Edit
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-8 col-12">
          <div className="row justify-content-center">
            <div className="col-md-3 col-6 mt-3">
              <div className="alert alert-warning">
                <h3>{latestStats.heartRate}</h3>
                <p>Heart Rate</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mt-3">
              <div className="alert alert-warning">
                <h3>{latestStats.temperature}</h3>
                <p>Temperature</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mt-3">
              <div className="alert alert-warning">
                <h3>{latestStats.humidity}</h3>
                <p>Humidity</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mt-3">
              {latestStats.color === "G" ? (
                <div className="alert alert-success">
                  <h3>Green</h3>
                  <p>Treatment Type</p>
                </div>
              ) : latestStats.color === "B" ? (
                <div className="alert alert-primary">
                  <h3>Blue</h3>
                  <p>Treatment Type</p>
                </div>
              ) : latestStats.color === "R" ? (
                <div className="alert alert-danger">
                  <h3>Red</h3>
                  <p>Treatment Type</p>
                </div>
              ) : latestStats.color === "" ? (
                <div className="alert alert-dark">
                  <h3>Not Specified</h3>
                  <p>Treatment Type</p>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="col-md-12 col-12 mt-3">
              <div className="alert alert-warning">
                <h3>
                  {new Date(latestStats.createdAt).toLocaleString(undefined, {
                    timeZone: "Asia/Kolkata",
                  })}
                </h3>
                <p>Last Updated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center mt-5">
        <div className="col-12">
          <h2>Historical Data</h2>
        </div>
        <div className="col-md-6 col-12">
          <HeartRate
            heartRate={historicalStats.heartRate}
            dates={historicalStats.updatedAt}
          />
          <h3>Heart rate</h3>
        </div>

        <div className="col-md-6 col-12">
          <Temp
            temperature={historicalStats.temperature}
            dates={historicalStats.updatedAt}
          />
          <h3>Temperature</h3>
        </div>
        <div className="col-md-6 col-12">
          <Temp
            temperature={historicalStats.humidity}
            dates={historicalStats.updatedAt}
          />
          <h3>Humidity</h3>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
