import logo from "./logo.svg";
import "./App.css";
import UpdateDevice from "./components/updatedevice";
import Dash from "./components/dashboard";
import Login from "./components/login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Dash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/update-device" element={<UpdateDevice />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
