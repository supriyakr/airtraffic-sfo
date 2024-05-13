"use client";
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function MostFrequentAirlinesPlot({ mostFrequentDestinations }) {
  const svgRef = useRef();

  useEffect(() => {
    if (mostFrequentDestinations && mostFrequentDestinations.length) {
      d3.select(svgRef.current).selectAll("*").remove();

      const width = 900; 
      const height = 600;
      const margin = 170;
      const radius = Math.min(width, height) / 2 - margin;

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2 - 100}, ${height / 2})`); 

      const color = d3
        .scaleOrdinal()
        .domain(mostFrequentDestinations.map((a) => a.geo_region))
        .range([
          "#ff7f0e", 
          "#1f77b4", 
          ...d3.schemeCategory10.slice(2)
        ]);

      const pie = d3
        .pie()
        .value((d) => d.count)
        .sort(null);

      const data_ready = pie(mostFrequentDestinations);

      const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

      const tooltip = d3
        .select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("box-shadow", "0 2px 10px rgba(0,0,0,0.1)")
        .style("opacity", 0);

      svg
        .selectAll("allSlices")
        .data(data_ready)
        .enter()
        .append("path")
        .attr("d", arcGenerator)
        .attr("fill", (d) => color(d.data.geo_region))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        .on("mouseover", function (event, d) {
          d3.select(this).style("opacity", 1);
          tooltip
            .html(
              `Destination: ${d.data.geo_region}<br>Flights: ${d.data.count}<br>Percentage: ${d.data.percentage}`
            )
            .style("left", event.pageX + 5 + "px")
            .style("top", event.pageY + 5 + "px")
            .style("opacity", 1);
        })
        .on("mousemove", function (event) {
          tooltip
            .style("left", event.pageX + 5 + "px")
            .style("top", event.pageY + 5 + "px");
        })
        .on("mouseout", function () {
          d3.select(this).style("opacity", 0.7);
          tooltip.style("opacity", 0);
        });

      // Add legend
      const legend = svg
        .selectAll(".legend")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${radius + 30}, ${i * 20 - height / 2 + margin - 50})`);

      legend
        .append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

      legend
        .append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .style("fill", "black")
        .text((d) => d);
    }
  }, [mostFrequentDestinations]);

  return <svg ref={svgRef}></svg>;
}
