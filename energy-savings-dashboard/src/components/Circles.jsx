import * as d3 from 'd3';
import { useState, useEffect, useRef } from 'react';

const Circles = () => {

    const generateRandomNumberBetween = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const generateDataset = () => {
        var data = [];
        const min = 10;
        const max = 20;
        
        for (var i = 0; i < 10; i++) {
            const posx = generateRandomNumberBetween(min, max);
            const posy = generateRandomNumberBetween(min, max);
            data.push([posx, posy])
        }
        return data;
    }

    const [dataset, setDataset] = useState(
      generateDataset()
    )
    const ref = useRef()
  
    useEffect(() => {
      const svgElement = d3.select(ref.current)
      svgElement.selectAll("circle")
        .data(dataset)
        .join("circle")
          .attr("cx", d => d[0])
          .attr("cy", d => d[1])
          .attr("r",  3)
    }, [dataset])
  
    return (
      <svg
        viewBox="0 0 100 50"
        ref={ref}
      />
    )
  }

  export default Circles;