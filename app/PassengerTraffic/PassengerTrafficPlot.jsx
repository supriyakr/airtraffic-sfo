"use client";
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function PassengerTrafficPlot({ trafficData }) {
  const svgRef = useRef();

  useEffect(() => {
    if (trafficData) {
      d3.select(svgRef.current).selectAll("*").remove();

      const margin = { top: 180, right: 150, bottom: 50, left: 60 };
      const width = 900 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const svg = d3
        .select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const terminals = Object.keys(trafficData);
      const boardingAreas = ["A", "B", "C", "D", "E", "F", "G"];

      const x = d3
        .scaleBand()
        .domain(terminals)
        .range([0, width])
        .padding([0.2]);

      const y = d3.scaleLinear().domain([0, 500000000]).range([height, 0]);

      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
        .style("fill", "black")
        .style("font-weight", "bold");

      svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d => `${d / 1000}K`))
        .selectAll("text")
        .style("fill", "black")
        .style("font-weight", "bold");

      const color = d3.scaleOrdinal()
        .domain(boardingAreas)
        .range(d3.schemeTableau10);

      const stackedData = d3.stack()
        .keys(boardingAreas)
        .value((d, key) => d[1][key])(Object.entries(trafficData));

      // Tooltip
      const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("font-size", "12px")
        .style("color", "black");

      svg.append("g")
        .selectAll("g")
        .data(stackedData)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d.data[0]))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .on("mouseover", function(event, d) {
          tooltip.style("visibility", "visible");
        })
        .on("mousemove", function(event, d) {
          const terminal = d.data[0];
          const boardingArea = this.parentNode.__data__.key;
          const passengers = d[1] - d[0];
          tooltip.html(`Terminal: ${terminal}<br>Boarding Area: ${boardingArea}<br>Passengers: ${passengers}`)
            .style("top", `${event.pageY - 50}px`)
            .style("left", `${event.pageX + 20}px`);
        })
        .on("mouseout", function() {
          tooltip.style("visibility", "hidden");
        });

      const legend = svg.append("g")
        .attr("transform", `translate(${width + 20}, 20)`);

      legend.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .text("Boarding Areas:")
        .style("font-size", "14px")
        .style("fill", "black")
        .style("font-weight", "bold")
        .attr("alignment-baseline", "middle");

      boardingAreas.forEach((key, i) => {
        legend.append("rect")
          .attr("x", 0)
          .attr("y", i * 20)
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", color(key));

        legend.append("text")
          .attr("x", 20)
          .attr("y", i * 20 + 9)
          .text(key)
          .style("font-size", "12px")
          .style("fill", "black")
          .style("font-weight", "bold")
          .attr("alignment-baseline", "middle");
      });

      svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .style("fill", "black")
        .style("font-weight", "bold")
        .text("")
        .attr("dy", "-2em");
    }
  }, [trafficData]);

  return <svg ref={svgRef}></svg>;
}
