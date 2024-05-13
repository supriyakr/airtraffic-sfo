"use client";
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function MostFrequentAirlinesPlot({ mostFrequentAirlines }) {
  const svgRef = useRef();

  useEffect(() => {
    if (mostFrequentAirlines && mostFrequentAirlines.length) {
      d3.select(svgRef.current).selectAll("*").remove();

      const width = 800;
      const height = 600;

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      // Adjust the radius scale to make the bubbles larger
      const radiusScale = d3
        .scaleSqrt()
        .domain([0, d3.max(mostFrequentAirlines, (d) => d.count)])
        .range([30, 100]); // Increase the range to make the bubbles bigger

      const tooltip = d3
        .select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("box-shadow", "0 2px 10px rgba(0,0,0,0.1)")
        .style("opacity", 0);

      const simulation = d3
        .forceSimulation(mostFrequentAirlines)
        .force("charge", d3.forceManyBody().strength(5))
        .force("center", d3.forceCenter(0, 0))
        .force(
          "collision",
          d3.forceCollide().radius((d) => radiusScale(d.count) + 2)
        )
        .on("tick", ticked);

      function ticked() {
        const u = svg
          .selectAll("circle")
          .data(mostFrequentAirlines)
          .join("circle")
          .attr("r", (d) => radiusScale(d.count))
          .attr("fill", (d) => color(d.airline))
          .attr("stroke", "white")
          .attr("stroke-width", 1.5)
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .on("mouseover", function (event, d) {
            d3.select(this).style("opacity", 0.7);
            tooltip
              .html(
                `Airline: ${d.airline}<br>Flights: ${d.count}<br>Percentage: ${d.percentage}`
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
            d3.select(this).style("opacity", 1);
            tooltip.style("opacity", 0);
          });

        const labels = svg
          .selectAll("text")
          .data(mostFrequentAirlines)
          .join("text")
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y)
          .attr("dy", ".3em")
          .attr("text-anchor", "middle")
          .style("fill", "white")
          .style("font-size", 12)
          .text((d) => d.airline)
          .each(wrapText); // Ensure the text wraps properly

        function wrapText(d) {
          const text = d3.select(this);
          const words = d.airline.split(/\s+/).reverse();
          let word;
          let line = [];
          const lineHeight = 1.1; // ems
          const x = text.attr("x");
          const y = text.attr("y");
          let tspan = text.text(null).append("tspan").attr("x", x).attr("y", y);
          while ((word = words.pop())) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > radiusScale(d.count) * 2) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", lineHeight + "em")
                .text(word);
            }
          }
        }
      }
    }
  }, [mostFrequentAirlines]);

  return <svg ref={svgRef}></svg>;
}
