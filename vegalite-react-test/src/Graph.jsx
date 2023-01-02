import React, { useRef, useState } from 'react';
import { VegaLite } from 'react-vega';



export const Graph = () => {
  const [view, setView] = useState();

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "A simple bar chart with embedded data.",
    "data": {
      "values": [
        {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
        {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53},
        {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}
      ]
    },
    "mark": "bar",
    "encoding": {
      "x": {"field": "a", "type": "nominal", "axis": {"labelAngle": 0}},
      "y": {"field": "b", "type": "quantitative"}
    }
  };

  return (
    <>
      <h3>React Vega Streaming Data</h3>
      <div>
        <VegaLite
          spec={spec}
          actions={false}
          renderer={'svg'}
        />
      </div>
    </>
  );
}
export default Graph;