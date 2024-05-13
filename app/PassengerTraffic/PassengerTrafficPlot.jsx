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

            // Draw each slice
            const arcs = g.selectAll('arc')
                .data(pie(terminalTrfc))
                .enter()
                .append('g');

            const newColorScale = d3.scaleOrdinal().range(['#145C96', '#0EBEDD', '#709FA2', '#D5E7F1']);

            arcs.append('path')
                .attr('d', arc)
                .attr('fill', (d, i) => newColorScale(i))
                .on('mouseover', function(d) {
                    if (d.data) {
                        const { terminal, passenger_count } = d.data;
                        d3.select(this).transition().duration(200).attr('opacity', 0.7);
                        svg.append('text')
                            .attr('class', 'tooltip')
                            .attr('x', width / 2)
                            .attr('y', height / 2 - radius / 2)
                            .attr('text-anchor', 'middle')
                            .text(`${terminal}: ${passenger_count}`)
                            .attr('font-size', '14px');
                    }
                })
                .on('mouseout', function() {
                    d3.select(this).transition().duration(200).attr('opacity', 1);
                    svg.select('.tooltip').remove();
                });

            arcs.append('text')
                .attr('transform', d => `translate(${arc.centroid(d)})`)
                .attr('text-anchor', 'middle')
                .text(d => `${d.data.terminal}\n(${((d.endAngle - d.startAngle) / (2 * Math.PI) * 100).toFixed(0)}%)`);
        }
    }, [terminalTrfc]);

    return (
        <svg ref={svgRef} width={500} height={500}></svg>
    );
}

export default PassengerTrafficPlot;

