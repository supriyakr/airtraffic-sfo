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
            const margin = { top: 20, right: 30, bottom: 120, left: 40 };  // Adjusted bottom margin for legend
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

            // Add legend below the graph
            const legend = svg.append('g')
                .attr('transform', `translate(${width / 2 - 150}, ${height - margin.bottom + 40})`); // Centered and adjusted for spacing

            const legendData = [
                { label: 'Domestic Passengers', color: '#003F72' },
                { label: 'International Passengers', color: '#709FA2' }
            ];

            legend.selectAll('rect')
                .data(legendData)
                .enter()
                .append('rect')
                .attr('x', (d, i) => i * 200) // Adjusted spacing
                .attr('y', 0)
                .attr('width', 18)
                .attr('height', 18)
                .attr('fill', d => d.color);

            legend.selectAll('text')
                .data(legendData)
                .enter()
                .append('text')
                .attr('x', (d, i) => i * 200 + 24) // Adjusted spacing
                .attr('y', 9)
                .attr('dy', '0.35em')
                .text(d => d.label);
        }
    }, [terminalTrfc]);

    return (
        <>
            <svg ref={svgRef} width={800} height={600}></svg>
            <div ref={tooltipRef} className="tooltip" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', background: 'white', padding: '5px', borderRadius: '3px', border: '1px solid #ccc' }}></div>
        </>
    );
}

export default TerminalTrafficPlot;
