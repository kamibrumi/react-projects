import * as d3 from "d3";
import { scaleSqrt } from "d3";
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
      console.log(og_data)
      // process the data, compute averages for only one technique
      // const average_numbers = {};
      // const count_numbers = {};
      const data_per_app_per_technique = {}

      for (var i = 0; i < og_data.length; i++) {
        const og_data_row = og_data[i];
        const app_name = og_data_row["APP_NAME"];
        if (!(app_name in data_per_app_per_technique)) {
          // if the data we create doesn't have the app name as a key, we create it
          data_per_app_per_technique[app_name] = 
            Object.fromEntries(
              GROUPED_BARCHART_CONFIG.TECHNIQUE_NAMES.map((technique_name) => [technique_name, []])
            );
        }
        data_per_app_per_technique[app_name][og_data_row["CONFIG"]].push(parseFloat(og_data_row["energy_savings"]));
      }

      console.log("data_per_app_per_technique", data_per_app_per_technique);

      // compute the average, standard deviation and standard error
      // each bar will have an associated standard deviation, then I will take that and divide it by the square root of the number of samples to obtain teh standard error

      // data_per_app_per_technique
      //  key - app name
      //  value - object
      //    key - technique name
      //    value - array of all numbers

      // reformat the data so it fits the input format for the grouped barplot. also compute what's the minimum average in order to pass it to the d3 scale
      var min = 1000;
      var max = -1000;
      const data = Object.keys(data_per_app_per_technique).map(function(key) {
        console.log("average_numbers[key]", data_per_app_per_technique[key]);
        // if (d3.min(average_numbers[key]) < min) { min = d3.min(average_numbers[key]); }
        // if (d3.max(average_numbers[key]) > max) { max = d3.max(average_numbers[key]); }

        const means_and_stderrors_by_appname_and_technique_arr = GROUPED_BARCHART_CONFIG.TECHNIQUE_NAMES.map(function(technique) {
          const numbers_for_this_app_and_technique = data_per_app_per_technique[key][technique];
          const technique_mean = technique + "_mean";
          const technique_std_error = technique + "_stderr";
          return {
            technique: technique,
            [technique_mean]: d3.mean(numbers_for_this_app_and_technique),
            [technique_std_error]: d3.deviation(numbers_for_this_app_and_technique)/scaleSqrt(d3.count(numbers_for_this_app_and_technique)),
          }
        });

        // TODO: left here where I will have to figure out how to convert all this data in to the object I drew on paper (*)

        return {app_name: key, ...Object.fromEntries(
          GROUPED_BARCHART_CONFIG.TECHNIQUE_NAMES.map((technique_name, index) => [technique_name, average_numbers[key][index]]) // TODO: add here another ...ObjectEntries with the std errors
      )};
      });
      console.log("count_numbers", count_numbers);


      const subgroups = GROUPED_BARCHART_CONFIG.TECHNIQUE_NAMES;
      console.log("subgroups", subgroups);

      // List of groups = species here = value of the first column called group -> I show them on the X axis
      const groups = Object.keys(data_per_app_per_technique);

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
      const y = d3.scaleLinear().domain([min - 1, max + 1]).range([height, 0]); // min - 1 in the range because I want to give the negative values some space, same for the max and the positivve values
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
        .attr("y", (d) => y(Math.max(0, d.value))) //y(d.value)) // in order to support negative values
        .attr("width", xSubgroup.bandwidth())
        .attr("height", (d) => Math.abs(y(d.value) - y(0)))//height - y(d.value))
        .attr("fill", (d) => color(d.key));

        // .attr("y", function(d) { return y(Math.max(0, d.count)); })
        // .attr("height", function(d) { return Math.abs(y(d.count) - y(0)); })  

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

        // var data_fake = [[0, 50], [100, 80]];

        // var lineGenerator = d3.line();
        // var pathString = lineGenerator(data_fake);

        // svg.select('path')
        //   .attr('d', pathString);

        // const lineGenerator = d3.line().x(d=>x(d.))


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
