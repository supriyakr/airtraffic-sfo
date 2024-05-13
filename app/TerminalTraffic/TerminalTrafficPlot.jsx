"use client";
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function TerminalTrafficPlot({ terminalTrfc }) {
    const svgRef = useRef();
    const tooltipRef = useRef();  // Ref for the tooltip div

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const tooltip = d3.select(tooltipRef.current); // Select the tooltip using d3

        if (terminalTrfc.length > 0) {
            svg.selectAll("*").remove(); // Clear previous SVG contents

            const width = +svg.attr('width');
            const height = +svg.attr('height');
            const margin = { top: 20, right: 30, bottom: 60, left: 40 };
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

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

            svg.append('g')
              .attr('transform', `translate(${margin.left},${innerHeight + margin.top})`)
              .call(d3.axisBottom(xScale));

            svg.append('g')
              .attr('transform', `translate(${margin.left},${margin.top})`)
              .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(d => `${d / 1000}K`));

            const g = svg.append('g')
              .attr('transform', `translate(${margin.left},${margin.top})`);

            g.selectAll('rect')
              .data(terminalTrfc)
              .enter()
              .append('rect')
              .attr('x', d => xScale(d.terminal) + xScale.bandwidth() / 4)
              .attr('y', d => yScale(d.passenger_count))
              .attr('width', xScale.bandwidth() / 2)
              .attr('height', d => innerHeight - yScale(d.passenger_count))
              .attr('fill', d => colorScale(d.geo_summary))
              .on('mouseover', function(event, d) {
                tooltip.html(`${d.terminal}, ${d.geo_summary} Passengers: ${d.passenger_count.toLocaleString()}`)
                       .style('opacity', 1)
                       .style('left', `${event.pageX + 5}px`)
                       .style('top', `${event.pageY - 28}px`);
              })
              .on('mouseout', () => tooltip.style('opacity', 0));

            // Add legend and other components as before
        }
    }, [terminalTrfc]);

    return (
        <>
            <svg ref={svgRef} width={800} height={600}></svg>
            <div ref={tooltipRef} className="tooltip"></div>
        </>
    );
}

export default TerminalTrafficPlot;