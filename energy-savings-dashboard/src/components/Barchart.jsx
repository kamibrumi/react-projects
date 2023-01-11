import * as d3 from "d3";
import { useEffect, useRef } from "react";
import dataset from "../data/all_data_10986_energy_savings.csv"

const Barchart = () => {
  const GROUPED_BARCHART_CONFIG = {
    N_TECHNIQUES : 3,
    TECHNIQUE_NAMES : ['hyfm', 'fmsa', 'salssa']
  }

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

    // Parse the Data
    d3.csv(
      dataset
    ).then(function (og_data) {
      console.log(og_data);

      // process the data, compute averages for only one technique
      const average_numbers = {};
      const std_numbers = {};
      const count_numbers = {};

      for (var i = 0; i < og_data.length; i++) {
        const og_data_row = og_data[i];
        const app_name = og_data_row['APP_NAME'];
        if (!(app_name in average_numbers)) { // if the data we create doesn't have the app name as a key, we create it
          average_numbers[app_name] = new Array(GROUPED_BARCHART_CONFIG.N_TECHNIQUES).fill(0);
          count_numbers[app_name] = new Array(GROUPED_BARCHART_CONFIG.N_TECHNIQUES).fill(0);
        }

        // now add the energy savings to the right position in the energy savings average array
        const idx = GROUPED_BARCHART_CONFIG.TECHNIQUE_NAMES.indexOf(og_data_row['CONFIG']);
        // console.log("testing the energy savings numbers to see if they are numbers or strings");
        // console.log(og_data_row['energy_savings']);
        average_numbers[app_name][idx] += parseFloat(og_data_row['energy_savings']);
        // console.log("testing the average_numbers for app name");
        // console.log(average_numbers[app_name]);
        count_numbers[app_name][idx] += 1;
      }

      // console.log("average_numbers");
      // console.log(average_numbers);

      // console.log("count_numbers");
      // console.log(count_numbers);


      // compute the averages and standard devs
      for (const [app_name, averages] of Object.entries(average_numbers)) {
        // console.log(`${key}: ${value}`);
        const average_energy_savings_array = [];
        for (var i = 0; i < GROUPED_BARCHART_CONFIG.N_TECHNIQUES; i++) {
          average_energy_savings_array.push(averages[i] / count_numbers[app_name][i]);
        }
        average_numbers[app_name] = average_energy_savings_array;
        
      }

      // console.log("average_numbers");
      // console.log(average_numbers);
      const data = average_numbers;

      // reformat the data so it fits the input format for the grouped barplot.
      const average_data_arr = [];
      for (const [app_name, averages] of Object.entries(average_numbers)) {
        const group = {
          app_name: app_name
        }
        for (var i = 0; i < GROUPED_BARCHART_CONFIG.N_TECHNIQUES; i++) {
          group[GROUPED_BARCHART_CONFIG.TECHNIQUE_NAMES[i]] = averages[i];
        }

        average_data_arr.push(group);
      }
      console.log("reformatted data");
      console.log(average_data_arr);


      // X axis
      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.Country))
        .padding(0.2);
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      // Add Y axis
      const y = d3.scaleLinear().domain([0, 13000]).range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      // Bars
      svg
        .selectAll("mybar")
        .data(data)
        .join("rect")
        .attr("x", (d) => x(d.Country))
        .attr("y", (d) => y(d.Value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.Value))
        .attr("fill", "#5f0f40");
    });
  }, []);

  return <svg width={460} height={400} id="barchart" ref={ref} />;
};

export default Barchart;
