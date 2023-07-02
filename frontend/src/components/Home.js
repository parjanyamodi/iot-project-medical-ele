import { useEffect, useState } from "react";
import constants from "../constants.json";

const Home = (props) => {
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    getDevices();
  }, []);
  const getDevices = () => {
    fetch(constants.baseUrl + "/device", {
      method: "GET",
      headers: { "content-type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setDevices(data.data);
      });
  };
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mt-5">
        <div className="col-12">
          <h1>MedCloud</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="alert alert-warning">
            <h1>List of Devices</h1>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        {devices.map((device, index) => {
          const i = index > 3 ? index - 4 : index;
          return (
            <div className="col-md-4 col-12">
              <div className={"card card-bg-" + i}>
                <div className="card-body">
                  <h2>{device.deviceID}</h2>

                  <p>
                    <strong>Doctor's Name:</strong>
                    {device.doctorName}
                  </p>
                  <p>
                    <strong>Doctor's Email:</strong>
                    {device.doctorEmail}
                  </p>
                  <p>
                    <strong>Attender's Name:</strong>
                    {device.attenderName}
                  </p>
                  <p>
                    <strong>Attender's Email:</strong>
                    {device.attenderEmail}
                  </p>
                  <p>
                    <strong>Age:</strong>
                    {device.age}
                  </p>
                  <p>
                    <strong>Mother's Name:</strong>
                    {device.motherName}
                  </p>

                  <button
                    className="btn btn-dark"
                    onClick={(e) =>
                      window.location.replace(
                        "/dashboard?deviceID=" + device.deviceID
                      )
                    }
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Home;
