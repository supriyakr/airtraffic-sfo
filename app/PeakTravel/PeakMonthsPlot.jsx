"use client";
import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";

export default function PeakMonthsPlot({ peakMonths }) {
  const svgRef = useRef();

  useEffect(() => {
    return () => {
      const data = peakMonths;
      if (data && data.length) {
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = 600 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3
          .select(svgRef.current)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3
          .scaleBand()
          .domain(data.map((d) => d.month))
          .range([0, width]);
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        const y = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.passenger_count + 1000000)])
          .range([height, 0]);

        const yAxis = d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat(function (d) {
            if (d / 1000 >= 1) {
              d = Math.floor(d / 1000) + " K";
            }
            return d;
          });

        svg.append("g").call(yAxis);

        // Add the line
        const line = d3
          .line()
          .x((d, i) => x(d.month)) // Using index as x-coordinate
          .y((d) => y(d.passenger_count));
       
        svg
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "#007bff")
          .attr("stroke-width", 2)
          .attr("d", line);
        // create a tooltip
    
        var Tooltip = d3.select("body")
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("background-color", "black")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .style("padding", "5px");

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function (event, d) {
          Tooltip.style("opacity", 1);
        };
        const mousemove = function (event, d) {
          Tooltip.html("Exact value: " + d.passenger_count)
            .style("left", `${event.pageX + 10}px`) // Use event.pageX
            .style("top", `${event.pageY - 28}px`) // Use event.pageY and adjust the offset
            .style("opacity", 1);
        };
        const mouseleave = function (event, d) {
          Tooltip.style("opacity", 0);
        };

        // Add the points
        svg
          .append("g")
          .selectAll("dot")
          .data(data)
          .join("circle")
          .attr("class", "myCircle")
          .attr("cx", (d) => {
            return x(d.month);
          })
          .attr("cy", (d) => {
            return y(d.passenger_count);
          })
          .attr("r", 5)
          .attr("stroke", "#69b3a2")
          .attr("stroke-width", 3)
          .attr("fill", "white")
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave);
      }
    };
  }, [peakMonths]);

  return <svg ref={svgRef}></svg>;
}
