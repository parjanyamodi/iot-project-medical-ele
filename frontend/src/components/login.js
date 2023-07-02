import Cookies from "universal-cookie";
import constants from "../constants.json";
import { useState } from "react";
const Login = () => {
  const cookies = new Cookies();
  const user = cookies.get("user");
  const [email, setemail] = useState("");
  const [otp, setOtp] = useState("");
  const [secret, setSecret] = useState("");
  const sendLoginRequest = async (e) => {
    e.preventDefault();
    const response = await fetch(constants.baseUrl + "/get-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data.status == 200) {
      setSecret(data.otp);
      alert("Check email for OTP!");
    } else {
      alert("Error occured");
    }
  };
  const verifyOTP = (e) => {
    e.preventDefault();
    if (otp == secret) {
      cookies.set("user", JSON.stringify({ email }), { path: "/" });
      alert("OTP correct");
      window.location.replace("/");
    } else {
      alert("OTP Incorrect");
    }
  };
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-12">
          <h1>MedCloud</h1>
        </div>
      </div>
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-12">
          <form>
            <div class="form-group mb-2">
              <label for="exampleInputEmail1">Email address</label>
              <input
                type="email"
                class="form-control"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              <small id="emailHelp" class="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              onClick={(e) => {
                sendLoginRequest(e);
              }}
            >
              Send OTP
            </button>
            <div class="form-group mb-2">
              <label for="exampleInputPassword1">Password</label>
              <input
                type="text"
                class="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              type="submit"
              class="btn btn-primary"
              onClick={(e) => {
                verifyOTP(e);
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
export default Login;
