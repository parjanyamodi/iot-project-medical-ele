import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import constants from "../constants.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "top",
    },
  },
};

const Color = () => {
  const [data, setData] = useState([]);
  const [state, setState] = useState(false);
  useEffect(() => {
    fetch(constants.baseUrl + "/get-data", {
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
    console.log(data[0]);
    setState(true);
  }, []);
  if (state) {
    return (
      <>
        {data.map((d) => {
          return (
            <Line
              options={options}
              data={{
                labels: d.updatedAt,
                datasets: [
                  {
                    data: d.color,
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                  },
                ],
              }}
            />
          );
        })}
      </>
    );
  } else {
    return <h1> Loading </h1>;
  }
};

export default Color;
