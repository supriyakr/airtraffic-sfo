"use client";
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

export default function EnplanedDeplanedPlot({ data }) {
  const svgRef = useRef();
  const [selectedLines, setSelectedLines] = useState({
    enplaned: true,
    deplaned: true,
    transit: true,
  });

  useEffect(() => {
    if (data) {
      d3.select(svgRef.current).selectAll("*").remove();

      const margin = { top: 60, right: 150, bottom: 50, left: 60 };
      const width = 900 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const svg = d3
        .select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const years = Object.keys(data);
      const enplanedData = years.map(year => ({ year, value: data[year].Enplaned }));
      const deplanedData = years.map(year => ({ year, value: data[year].Deplaned }));
      const transitData = years.map(year => ({ year, value: data[year]["Thru / Transit"] }));

      const x = d3.scaleBand()
        .domain(years)
        .range([0, width])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max([...enplanedData, ...deplanedData, ...transitData], d => d.value)])
        .nice()
        .range([height, 0]);

      const line = d3.line()
        .x(d => x(d.year) + x.bandwidth() / 2)
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX);

      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d => d).tickSizeOuter(0))
        .selectAll("text")
        .attr("fill", "black")
        .style("font-weight", "bold");

      svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d => `${d / 1000000}M`).tickSizeOuter(0))
        .selectAll("text")
        .attr("fill", "black")
        .style("font-weight", "bold");

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

      // Add lines
      if (selectedLines.enplaned) {
        svg.append("path")
          .datum(enplanedData)
          .attr("class", "line-enplaned")
          .attr("fill", "none")
          .attr("stroke", "green")
          .attr("stroke-width", 2)
          .attr("d", line);

        svg.selectAll(".dot-enplaned")
          .data(enplanedData)
          .enter().append("circle")
          .attr("class", "dot-enplaned")
          .attr("cx", d => x(d.year) + x.bandwidth() / 2)
          .attr("cy", d => y(d.value))
          .attr("r", 3)
          .attr("fill", "green")
          .on("mouseover", function (event, d) {
            tooltip.style("visibility", "visible");
          })
          .on("mousemove", function (event, d) {
            tooltip.html(`Year: ${d.year}<br>Enplaned Passengers: ${d.value}`)
              .style("top", `${event.pageY - 50}px`)
              .style("left", `${event.pageX + 20}px`);
          })
          .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
          });
      }

      if (selectedLines.deplaned) {
        svg.append("path")
          .datum(deplanedData)
          .attr("class", "line-deplaned")
          .attr("fill", "none")
          .attr("stroke", "red")
          .attr("stroke-width", 2)
          .attr("d", line);

        svg.selectAll(".dot-deplaned")
          .data(deplanedData)
          .enter().append("circle")
          .attr("class", "dot-deplaned")
          .attr("cx", d => x(d.year) + x.bandwidth() / 2)
          .attr("cy", d => y(d.value))
          .attr("r", 3)
          .attr("fill", "red")
          .on("mouseover", function (event, d) {
            tooltip.style("visibility", "visible");
          })
          .on("mousemove", function (event, d) {
            tooltip.html(`Year: ${d.year}<br>Deplaned Passengers: ${d.value}`)
              .style("top", `${event.pageY - 50}px`)
              .style("left", `${event.pageX + 20}px`);
          })
          .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
          });
      }

      if (selectedLines.transit) {
        svg.append("path")
          .datum(transitData)
          .attr("class", "line-transit")
          .attr("fill", "none")
          .attr("stroke", "cyan")
          .attr("stroke-width", 2)
          .attr("d", line);

        svg.selectAll(".dot-transit")
          .data(transitData)
          .enter().append("circle")
          .attr("class", "dot-transit")
          .attr("cx", d => x(d.year) + x.bandwidth() / 2)
          .attr("cy", d => y(d.value))
          .attr("r", 3)
          .attr("fill", "cyan")
          .on("mouseover", function (event, d) {
            tooltip.style("visibility", "visible");
          })
          .on("mousemove", function (event, d) {
            tooltip.html(`Year: ${d.year}<br>Thru/Transit Passengers: ${d.value}`)
              .style("top", `${event.pageY - 50}px`)
              .style("left", `${event.pageX + 20}px`);
          })
          .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
          });
      }

      const legend = svg.append("g")
        .attr("transform", `translate(${width + 20}, 0)`);

      const legendItems = [
        { color: "green", text: "Enplaned ", key: "enplaned" },
        { color: "red", text: "Deplaned ", key: "deplaned" },
        { color: "cyan", text: "Thru/Transit ", key: "transit" },
      ];

      legendItems.forEach((item, i) => {
        legend.append("rect")
          .attr("x", 0)
          .attr("y", i * 20)
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", item.color)
          .on("click", () => {
            setSelectedLines(prev => ({
              ...prev,
              [item.key]: !prev[item.key]
            }));
          });

        legend.append("text")
          .attr("x", 20)
          .attr("y", i * 20 + 9)
          .text(item.text)
          .style("font-size", "12px")
          .attr("alignment-baseline", "middle")
          .attr("fill", "black")
          .style("font-weight", "bold")
          .on("click", () => {
            setSelectedLines(prev => ({
              ...prev,
              [item.key]: !prev[item.key]
            }));
          });
      });
    }
  }, [data, selectedLines]);

  return <svg ref={svgRef}></svg>;
}
