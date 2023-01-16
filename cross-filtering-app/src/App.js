import "./App.css";
import Scatterplot from "./components/scatterplot/scatterplot.component";
import { useEffect, useState } from "react";
import * as d3 from "d3";

const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    d3.csv(
      "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv"
    ).then(function (dataset) {
      setData(dataset);
      console.log("app data has updated", data);
    });
  }, []);

  console.log("app re rendered");

  return (
    <div className="flex-container">
      <div className="flex-child magenta">
        <Scatterplot data={data} />
      </div>
      <div className="flex-child green">
        <Scatterplot data={data} />
      </div>
    </div>
  );
};

export default App;
