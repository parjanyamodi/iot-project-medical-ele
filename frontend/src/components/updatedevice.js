import { useState } from "react";
import constants from "../constants.json";

const UpdateDevice = () => {
  const [deviceID, setDeviceID] = useState("");
  const [attenderName, setAttenderName] = useState("");
  const [attenderEmail, setAttenderEmail] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [age, setAge] = useState(0);
  const [motherName, setMotherName] = useState("");

  const SubmitDetails = (e) => {
    e.preventDefault();
    fetch(constants.baseUrl + "/update", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        deviceID,
        attenderName,
        attenderEmail,
        doctorName,
        doctorEmail,
        age,
        motherName,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        alert(data.inserted ? "Data Updated" : "");
      });
  };
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-12 ">
          <form>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">
                Device ID
              </label>
              <input
                type="text"
                class="form-control"
                onChange={(e) => setDeviceID(e.target.value)}
                value={deviceID}
                aria-describedby="emailHelp"
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">
                Attender's Name
              </label>
              <input
                type="text"
                class="form-control"
                onChange={(e) => setAttenderName(e.target.value)}
                value={attenderName}
                id="exampleInputPassword1"
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">
                Attender's Email
              </label>
              <input
                type="email"
                class="form-control"
                onChange={(e) => setAttenderEmail(e.target.value)}
                value={attenderEmail}
                id="exampleInputPassword1"
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">
                Doctor's Name
              </label>
              <input
                type="text"
                class="form-control"
                onChange={(e) => setDoctorName(e.target.value)}
                value={doctorName}
                id="exampleInputPassword1"
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">
                Doctor's Email
              </label>
              <input
                type="email"
                class="form-control"
                onChange={(e) => setDoctorEmail(e.target.value)}
                value={doctorEmail}
                id="exampleInputPassword1"
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">
                Mother's Name
              </label>
              <input
                type="text"
                class="form-control"
                onChange={(e) => setMotherName(e.target.value)}
                value={motherName}
                id="exampleInputPassword1"
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">
                Age
              </label>
              <input
                type="number"
                class="form-control"
                onChange={(e) => setAge(e.target.value)}
                value={age}
                id="exampleInputPassword1"
              />
            </div>

            <button
              type="submit"
              class="btn btn-primary"
              onClick={(e) => {
                SubmitDetails(e);
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default UpdateDevice;
