import * as d3 from "d3";
import { useEffect, useRef } from "react";
import dataset from "../data/all_data_10986_energy_savings.csv";

const GroupedBarchart = () => {
  const GROUPED_BARCHART_CONFIG = {
    N_TECHNIQUES: 3,
    TECHNIQUE_NAMES: ["hyfm", "fmsa", "salssa"],
    WIDTH: 1000,
    HEIGHT: 400,
    COLORS: ["#002642", "#840032", "#e59500"],
  };
  const ref = useRef();

  useEffect(() => {
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 100, left: 50 },
      width = GROUPED_BARCHART_CONFIG.WIDTH - margin.left - margin.right,
      height = GROUPED_BARCHART_CONFIG.HEIGHT - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the Data
    d3.csv(dataset).then(function (og_data) {
      // process the data, compute averages for only one technique
      const average_numbers = {};
      const std_numbers = {};
      const count_numbers = {};

      for (var i = 0; i < og_data.length; i++) {
        const og_data_row = og_data[i];
        const app_name = og_data_row["APP_NAME"];
        if (!(app_name in average_numbers)) {
          // if the data we create doesn't have the app name as a key, we create it
          average_numbers[app_name] = new Array(
            GROUPED_BARCHART_CONFIG.N_TECHNIQUES
          ).fill(0);
          count_numbers[app_name] = new Array(
            GROUPED_BARCHART_CONFIG.N_TECHNIQUES
          ).fill(0);
        }

        // now add the energy savings to the right position in the energy savings average array
        const idx = GROUPED_BARCHART_CONFIG.TECHNIQUE_NAMES.indexOf(
          og_data_row["CONFIG"]
        );

        average_numbers[app_name][idx] += parseFloat(
          og_data_row["energy_savings"]
        );

        count_numbers[app_name][idx] += 1;
      }

      // compute the averages and standard devs
      for (const [app_name, averages] of Object.entries(average_numbers)) {
        // console.log(`${key}: ${value}`);
        const average_energy_savings_array = [];
        for (var i = 0; i < GROUPED_BARCHART_CONFIG.N_TECHNIQUES; i++) {
          average_energy_savings_array.push(
            averages[i] / count_numbers[app_name][i]
          );
        }
        average_numbers[app_name] = average_energy_savings_array;
      }

      // reformat the data so it fits the input format for the grouped barplot.
      const average_data_arr = [];
      for (const [app_name, averages] of Object.entries(average_numbers)) {
        const group = {
          app_name: app_name,
        };
        for (var i = 0; i < GROUPED_BARCHART_CONFIG.N_TECHNIQUES; i++) {
          group[GROUPED_BARCHART_CONFIG.TECHNIQUE_NAMES[i]] = averages[i];
        }

        average_data_arr.push(group);
      }

      const data = average_data_arr;
      console.log("data", data);

      // List of subgroups = header of the csv files = soil condition here
      // const subgroups = data.columns.slice(1);
      const subgroups = GROUPED_BARCHART_CONFIG.TECHNIQUE_NAMES;
      console.log("subgroups", subgroups);

      // List of groups = species here = value of the first column called group -> I show them on the X axis
      const groups = data.map((d) => d.app_name);

      console.log("groups", groups);

      // Add X axis
      const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
      const xAxis = svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      // Add Y axis
      const y = d3.scaleLinear().domain([0, 8]).range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      // Another scale for subgroup position?
      const xSubgroup = d3
        .scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05]);

      // color palette = one color per subgroup
      const color = d3
        .scaleOrdinal()
        .domain(subgroups)
        .range(GROUPED_BARCHART_CONFIG.COLORS);

      // Show the bars
      svg
        .append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(data)
        .join("g")
        .attr("transform", (d) => `translate(${x(d.app_name)}, 0)`)
        .selectAll("rect")
        .data(function (d) {
          return subgroups.map(function (key) {
            return { key: key, value: d[key] };
          });
        })
        .join("rect")
        .attr("x", (d) => xSubgroup(d.key))
        .attr("y", (d) => y(d.value))
        .attr("width", xSubgroup.bandwidth())
        .attr("height", (d) => height - y(d.value))
        .attr("fill", (d) => color(d.key));

      // Add one dot in the legend for each name.
      svg
        .selectAll("mydots")
        .data(GROUPED_BARCHART_CONFIG.TECHNIQUE_NAMES)
        .enter()
        .append("circle")
        .attr("cx", 850)
        .attr("cy", function (d, i) {
          return 10 + i * 25;
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function (d) {
          return color(d);
        });

      // Add one dot in the legend for each name.
      svg
        .selectAll("mylabels")
        .data(GROUPED_BARCHART_CONFIG.TECHNIQUE_NAMES)
        .enter()
        .append("text")
        .attr("x", 875)
        .attr("y", function (d, i) {
          return 14 + i * 25;
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d) {
          return color(d);
        })
        .text(function (d) {
          return d;
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");

      // console.log("before for loop");
      // for (var i = 0; i < GROUPED_BARCHART_CONFIG.N_TECHNIQUES; i++) {
      //   console.log(i);
      //   svg
      //     .append("circle")
      //     .attr("cx", 800)
      //     .attr("cy", 50 + i * 25)
      //     .attr("r", 6)
      //     .style("fill", GROUPED_BARCHART_CONFIG.COLORS[i]);

      //   svg
      //     .append("text")
      //     .attr("x", 825)
      //     .attr("y", 53 + i * 25)
      //     .text(GROUPED_BARCHART_CONFIG.TECHNIQUE_NAMES[i])
      //     .style("font-size", "15px")
      //     .attr("alignment-baseline", "middle");
      // }

      // svg
      //   .append("circle")
      //   .attr("cx", 200)
      //   .attr("cy", 160)
      //   .attr("r", 6)
      //   .style("fill", GROUPED_BARCHART_CONFIG.COLORS[1]);

      // svg
      //   .append("text")
      //   .attr("x", 220)
      //   .attr("y", 160)
      //   .text(GROUPED_BARCHART_CONFIG.TECHNIQUE_NAMES[1])
      //   .style("font-size", "15px")
      //   .attr("alignment-baseline", "middle");
    });
  }, []);

  return (
    <svg
      width={GROUPED_BARCHART_CONFIG.WIDTH}
      height={GROUPED_BARCHART_CONFIG.HEIGHT}
      id="barchart"
      ref={ref}
    />
  );
};

export default GroupedBarchart;
