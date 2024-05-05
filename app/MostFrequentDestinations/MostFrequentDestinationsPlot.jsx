"use client";
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function MostFrequentAirlinesPlot({ mostFrequentDestinations }) {
  const svgRef = useRef();

  useEffect(() => {
    if (mostFrequentDestinations && mostFrequentDestinations.length) {
      d3.select(svgRef.current).selectAll("*").remove();

      const width = 700;
      const height = 600;
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
        .domain(mostFrequentDestinations.map((a) => a.geo_region))
        .range(d3.schemeCategory10);

      const pie = d3
        .pie()
        .value((d) => parseFloat(d.percentage.replace("%", "")))
        .sort(null);

      const data_ready = pie(mostFrequentDestinations);

      const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

      const outerArc = d3
        .arc()
        .innerRadius(radius * 1.3)
        .outerRadius(radius * 1.3);

      svg
        .selectAll("allSlices")
        .data(data_ready)
        .enter()
        .append("path")
        .attr("d", arcGenerator)
        .attr("fill", (d) => color(d.data.geo_region))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);

      svg
        .selectAll("allPolylines")
        .data(data_ready)
        .enter()
        .append("polyline")
        .attr("points", function (d) {
          if (
            d.data.geo_region === "South America" ||
            d.data.geo_region === "Middle East"
          ) {
            const pos = outerArc.centroid(d);
            const shift = d.data.geo_region === "Middle East" ? 30 : 0; // Slight vertical shift for Middle East
            return [
              arcGenerator.centroid(d),
              outerArc.centroid(d),
              [width / 2 - margin, pos[1] + shift],
            ];
          } else {
            const posA = arcGenerator.centroid(d);
            const posB = outerArc.centroid(d);
            const posC = outerArc.centroid(d);
            posC[0] = radius * 1.4 * (midAngle(d) < Math.PI ? 1 : -1);
            return [posA, posB, posC];
          }
        })
        .style("fill", "none")
        .attr("stroke", "black")
        .style("stroke-width", 1);

      svg
        .selectAll("allLabels")
        .data(data_ready)
        .enter()
        .append("text")
        .text((d) => `${d.data.geo_region} (${d.data.percentage})`)
        .attr("transform", function (d) {
          if (
            d.data.geo_region === "South America" ||
            d.data.geo_region === "Middle East"
          ) {
            const pos = outerArc.centroid(d);
            const shift = d.data.geo_region === "Middle East" ? 30 : 0;
            return `translate(${[width / 2 - margin * 1.5, pos[1] + shift]})`;
          } else {
            const pos = outerArc.centroid(d);
            pos[0] = radius * 1.1 * (midAngle(d) < Math.PI ? 1 : -1);
            return `translate(${pos})`;
          }
        })
        .style("text-anchor", (d) =>
          d.data.geo_region === "South America" ||
          d.data.geo_region === "Middle East"
            ? "start"
            : midAngle(d) < Math.PI
            ? "start"
            : "end"
        )
        .style("font-size", 14);

      function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
      }
    }
  }, [mostFrequentDestinations]);

  return <svg ref={svgRef}></svg>;
}
