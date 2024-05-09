"use client";
// BoardingAreaTrafficPlot.jsx

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function BoardingAreaTrafficPlot({ boardingAreaTraffic }) {
    const svgRef = useRef();

    useEffect(() => {
        if (boardingAreaTraffic) {
            const svg = d3.select(svgRef.current);
            const width = +svg.attr('width');
            const height = +svg.attr('height');
            const margin = { top: 50, right: 50, bottom: 100, left: 50 }; // Increased bottom margin
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

            const x = d3.scaleBand()
                .domain(Object.keys(boardingAreaTraffic))
                .range([0, innerWidth])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, d3.max(Object.values(boardingAreaTraffic).flatMap(Object.values))])
                .range([innerHeight, 0]);

            const color = d3.scaleOrdinal(d3.schemeCategory10);

            const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            g.selectAll('.bar')
                .data(Object.entries(boardingAreaTraffic))
                .enter().append('g')
                .attr('class', 'bar')
                .attr('transform', d => `translate(${x(d[0])},0)`)
                .selectAll('rect')
                .data(d => Object.entries(d[1]))
                .enter().append('rect')
                .attr('x', d => x.bandwidth() / 4 * (d[0] === 'A' ? -1 : 1))
                .attr('y', d => y(d[1]))
                .attr('width', x.bandwidth() / 2)
                .attr('height', d => innerHeight - y(d[1]))
                .attr('fill', d => color(d[0]));

            g.append('g')
                .attr('class', 'axis')
                .attr('transform', `translate(0,${innerHeight})`)
                .call(d3.axisBottom(x));

            g.append('g')
                .attr('class', 'axis')
                .call(d3.axisLeft(y).ticks(5));

            g.append('text')
                .attr('x', innerWidth / 2)
                .attr('y', innerHeight + margin.top / 2)
                .attr('text-anchor', 'middle')
                .text('Terminal');

            g.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('x', -innerHeight / 2)
                .attr('y', -margin.left / 1.5)
                .attr('text-anchor', 'middle')
                .text('Passenger Count');

            const legend = g.selectAll('.legend')
                .data(Object.keys(boardingAreaTraffic))
                .enter().append('g')
                .attr('class', 'legend')
                .attr('transform', (d, i) => `translate(${i * 100}, ${innerHeight + margin.top + 20})`); // Adjusted translation

            legend.append('rect')
                .attr('x', 0)
                .attr('width', 18)
                .attr('height', 18)
                .style('fill', d => color(d));

            legend.append('text')
                .attr('x', 24)
                .attr('y', 9)
                .attr('dy', '.35em')
                .style('text-anchor', 'start')
                .text(d => d);
        }
    }, [boardingAreaTraffic]);

    return (
        <svg ref={svgRef} width={800} height={600}></svg>
    );
}

export default BoardingAreaTrafficPlot;
