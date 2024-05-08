"use client";
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function PassengerTrafficPlot({ terminalTrfc }) {
    const svgRef = useRef();

    useEffect(() => {
        if (terminalTrfc.length > 0) {
            const svg = d3.select(svgRef.current);
            const width = svg.attr('width');
            const height = svg.attr('height');
            const radius = Math.min(width, height) / 2;
            const color = d3.scaleOrdinal(d3.schemeCategory10);

            // Create a pie chart layout
            const pie = d3.pie().value(d => d.passenger_count);

            // Create an arc generator
            const arc = d3.arc().innerRadius(0).outerRadius(radius);

            // Append a group element for the pie chart
            const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

            // Generate pie chart slices
            const arcs = g.selectAll('arc').data(pie(terminalTrfc)).enter().append('g');

            // Draw each slice
            arcs.append('path')
                .attr('d', arc)
                .attr('fill', (d, i) => color(i));

            // Add labels
            arcs.append('text')
                .attr('transform', d => `translate(${arc.centroid(d)})`)
                .attr('text-anchor', 'middle')
                .text(d => d.data.terminal);

        }
    }, [terminalTrfc]);

    return (
        <svg ref={svgRef} width={400} height={400}></svg>
    );
}

export default PassengerTrafficPlot;
