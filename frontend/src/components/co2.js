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

const CO2 = (props) => {
  if (props.co2.length === 0 || props.dates.length === 0) {
    return <h1>Loading</h1>;
  } else {
    return (
      <Line
        options={options}
        data={{
          labels: props.dates,
          datasets: [
            {
              data: props.co2,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        }}
      />
    );
  }
};

export default CO2;
