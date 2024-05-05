"use client";
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function MostFrequentAirlinesPlot({ mostFrequentAirlines }) {
  const svgRef = useRef();

  useEffect(() => {
    if (mostFrequentAirlines && mostFrequentAirlines.length) {
      d3.select(svgRef.current).selectAll("*").remove();

      const width = 700;
      const height = 650;
      const margin = 170;
      const radius = Math.min(width, height) / 2 - margin;

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      const color = d3
        .scaleOrdinal()
        .domain(mostFrequentAirlines.map((a) => a.airline))
        .range(d3.schemeCategory10);

      const pie = d3
        .pie()
        .value((d) => parseFloat(d.percentage.replace("%", "")))
        .sort(null);

      const data_ready = pie(mostFrequentAirlines);

      // Shape helper to build arcs
      const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

      const outerArc = d3
        .arc()
        .innerRadius(radius * 1.1)
        .outerRadius(radius * 1.1);

      // Build the pie chart
      svg
        .selectAll("allSlices")
        .data(data_ready)
        .enter()
        .append("path")
        .attr("d", arcGenerator)
        .attr("fill", (d) => color(d.data.airline))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);

      // Add lines connecting the labels to the slices
      svg
        .selectAll("allPolylines")
        .data(data_ready)
        .enter()
        .append("polyline")
        .attr("points", function (d) {
          const posA = arcGenerator.centroid(d);
          const posB = outerArc.centroid(d);
          const posC = outerArc.centroid(d);
          posC[0] = radius * 0.97 * (midAngle(d) < Math.PI ? 1 : -1);
          return [posA, posB, posC];
        })
        .style("fill", "none")
        .attr("stroke", "black")
        .style("stroke-width", 1);

      // Add labels
      svg
        .selectAll("allLabels")
        .data(data_ready)
        .enter()
        .append("text")
        .text((d) => {
          if (d.data.airline == "Others") {
            return `${d.data.airline} ${d.data.included} countries (${d.data.percentage})`;
          } else {
            return `${d.data.airline} (${d.data.percentage})`;
          }
        })
        .attr("transform", function (d) {
          const pos = outerArc.centroid(d);
          pos[0] = radius * 0.7 * (midAngle(d) < Math.PI ? 1 : -1);
          return `translate(${pos})`;
        })
        .style("text-anchor", (d) => (midAngle(d) < Math.PI ? "start" : "end"))
        .style("font-size", 14);

      // Calculate the angle to determine the label alignment
      function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
      }
    }
  }, [mostFrequentAirlines]);

  return <svg ref={svgRef}></svg>;
}
