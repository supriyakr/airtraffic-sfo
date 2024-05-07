'use client'
import React, { useRef,useState,useEffect } from 'react'
import * as d3 from 'd3'


export default function PeakMonthsPlot({peakMonths}) {
  const svgRef = useRef();

  useEffect(() => {
    return () => {
    // console.log('Data:', data, data && data.length);
    const data = peakMonths;
    if (data && data.length) {
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const svg = d3.select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand()
        .domain(data.map(d => d.month))
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.passenger_count)])
        .range([height, 0]);

      const yAxis = d3.axisLeft(y)
        .ticks(5)
        .tickFormat(function (d) {
          if ((d / 1000) >= 1) {
            d = Math.floor(d / 1000) + " K";
          }
          return d;
        });

      const line = d3.line()
        .x((d, i) => x(d.month)) // Using index as x-coordinate
        .y(d => y(d.passenger_count))
        .curve(d3.curveCatmullRom);

      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#007bff")
        .attr("stroke-width", 2)
        .attr("d", line);

      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      svg.append("g")
        .call(yAxis);
    }
  }
  }, [peakMonths]);

  return (
    <svg ref={svgRef}></svg>
  );
}

