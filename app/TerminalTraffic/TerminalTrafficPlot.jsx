"use client";
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function TerminalTrafficPlot({ terminalTrfc }) {
  const svgRef = useRef();

  useEffect(() => {
    if (terminalTrfc.length > 0) {
      const svg = d3.select(svgRef.current);
      const width = +svg.attr('width');
      const height = +svg.attr('height');
      const margin = { top: 20, right: 30, bottom: 60, left: 40 }; // Increased bottom margin for legend
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Create scales
      const xScale = d3.scaleBand()
        .domain(terminalTrfc.map(d => d.terminal))
        .range([0, innerWidth])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(terminalTrfc, d => d.passenger_count)])
        .nice()
        .range([innerHeight, 0]);

      const colorScale = d3.scaleOrdinal()
        .domain(['Domestic', 'International'])
        .range(['#003F72', '#709FA2']);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth)
        .tickFormat(d => {
          if ((d / 1000) >= 1) {
            d = Math.floor(d / 1000) + "K";
          }
          return d;
        });

      // Append group elements for axes
      svg.append('g')
        .attr('transform', `translate(${margin.left},${innerHeight + margin.top})`)
        .call(xAxis);

      svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .call(yAxis);

      // Append group element for bars
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Draw bars
      g.selectAll('rect')
        .data(terminalTrfc)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.terminal) + xScale.bandwidth() / 4)
        .attr('y', d => yScale(d.passenger_count))
        .attr('width', xScale.bandwidth() / 2)
        .attr('height', d => innerHeight - yScale(d.passenger_count))
        .attr('fill', d => colorScale(d.geo_summary))
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        // Add hover effect
        .on('mouseover', function(d) {
          d3.select(this).attr('fill', 'orange');
          // Show number on hover
          g.append('text')
            .attr('class', 'hover-text')
            .attr('x', xScale(d.terminal) + xScale.bandwidth() / 2)
            .attr('y', yScale(d.passenger_count) - 10)
            .attr('text-anchor', 'middle')
            .text(d.passenger_count);
        })
        .on('mouseout', function() {
          d3.select(this).attr('fill', d => colorScale(d.geo_summary));
          // Remove number on hover out
          svg.select('.hover-text').remove();
        });

      // Create legend
      const legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${margin.left + i * 120},${height - margin.bottom + 20})`); // Adjusted translation for legend below x-axis

      legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colorScale);

      legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text((d) => d);
    }
  }, [terminalTrfc]);

  return (
    <svg ref={svgRef} width={800} height={600}></svg>
  );
}

export default TerminalTrafficPlot;
