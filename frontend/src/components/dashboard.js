import Cookies from "universal-cookie";
import Graph from "./co2";
import HeartRate from "./heartRate";
import Temp from "./temp";
import Color from "./color";
import { useEffect, useState } from "react";
import constants from "../constants.json";
const Dash = () => {
  const cookies = new Cookies();
  const user = cookies.get("user");
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(constants.baseUrl + "/device", {
      method: "GET",
      headers: {
        "content-type": "Application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setData(data.data);
      });
  }, []);
  if (user)
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            {data.map((d) => {
              return (
                <div className="card">
                  <div className="card-body">
                    <p>Device ID:{d.deviceID}</p>
                    <p>Doctor's Name:{d.doctorName}</p>
                    <p>Doctor's Email:{d.doctorEmail}</p>
                    <p>Attender's Name:{d.attenderName}</p>
                    <p>Attender's Email:{d.attenderEmail}</p>
                    <p>Age:{d.age}</p>
                    <p>Mother's Name:{d.motherName}</p>
                    <button
                      onClick={() => window.location.replace("/update-device")}
                    >
                      Update
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6 col-12">
            <Graph />
            <h1>CO2 Levels</h1>
          </div>
          <div className="col-md-6 col-12">
            <HeartRate />
            <h1>Heart Rate</h1>
          </div>
          <div className="col-md-6 col-12">
            <Temp />
            <h1>Temperature</h1>
          </div>
          {/* <div className="col-md-6 col-12">
            <Color />
            <h1>Heart Rate</h1>
          </div> */}
        </div>
      </div>
    );
  else window.location.replace("/login");
};
export default Dash;
