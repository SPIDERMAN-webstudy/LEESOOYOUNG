import React from "react";

import ChartBar from "./ChartBar";
import "./Chart.css";

const Chart = (props) => {
  const newArray = props.dataPoints.map((dataPoint) => dataPoint.value);
  const newMax = Math.max(...newArray);

  return (
    <div className="chart">
      {props.dataPoints.map((dataPoint) => (
        <ChartBar
          key={dataPoint.id}
          value={dataPoint.value}
          maxValue={newMax}
          label={dataPoint.label}
        />
      ))}
    </div>
  );
};

export default Chart;
