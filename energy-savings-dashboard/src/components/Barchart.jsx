import * as d3 from "d3";
import { useEffect, useRef } from "react";

const Barchart = () => {
  const ref = useRef();

  useEffect(() => {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(ref.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Initialize the X axis
    const x = d3.scaleBand().range([0, width]).padding(0.2);
    const xAxis = svg.append("g").attr("transform", `translate(0,${height})`);

    // Initialize the Y axis
    const y = d3.scaleLinear().range([height, 0]);
    const yAxis = svg.append("g").attr("class", "myYaxis");

    d3.csv(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/barplot_change_data.csv"
    ).then(function (data) {
      console.log(data);
      // X axis
      x.domain(data.map((d) => d.group));
      xAxis.transition().duration(1000).call(d3.axisBottom(x));

      // Add Y axis
      y.domain([0, d3.max(data, (d) => +d["var1"])]);
      yAxis.transition().duration(1000).call(d3.axisLeft(y));

      // variable u: map data to existing bars
      const u = svg.selectAll("rect").data(data);

      // update bars
      u.join("rect")
        .transition()
        .duration(1000)
        .attr("x", (d) => x(d.group))
        .attr("y", (d) => y(d["var1"]))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d["var1"]))
        .attr("fill", "#69b3a2");
    });
  }, []);

  return <svg width={460} height={400} id="barchart" ref={ref} />;
};

export default Barchart;
