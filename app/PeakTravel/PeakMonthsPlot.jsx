"use client";
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";


export default function PeakMonthsPlot({peakMonths}) {
  const svgRef = useRef();

  useEffect(() => {
    return () => {
      const data = peakMonths;
      if (data) {
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = 600 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3
          .select(svgRef.current)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        // List of groups (here I have one group per column)
        const yearsArray = Object.keys(peakMonths).map(Number);
        console.log(yearsArray);

        // add the options to the button
        d3.select("#selectButton")
          .selectAll("myOptions")
          .data(yearsArray)
          .enter()
          .append("option")
          .text((d) => d) // text showed in the menu
          .attr("value", (d) => d); // corresponding value returned by the button

        //x-axis
        const x = d3
          .scaleBand()
          .domain(data[2000].map((d) => d.monthName))
          .range([0,width])
          .padding(1);
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
        // y-axis
        const y = d3.scaleLinear().domain([0, 6000000]).range([height, 0]);

        //y-axis formatting
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

        // Initialize line with group a
        const line = svg
          .append("path")
          .datum(data[2000])
          .attr(
            "d",
            d3
              .line()
              .x((d) => x(d.monthName))
              .y((d) => y(d.passenger_count))
          )
          .attr("stroke", "#007bff")
          .style("stroke-width", 2)
          .style("fill", "none");

        // Initialize dots with group a
        const dot = svg
          .selectAll("circle")
          .data(data[2000])
          .join("circle")
          .attr("class", "myCircle")
          .attr("cx", (d) => x(d.monthName))
          .attr("cy", (d) => y(d.passenger_count))
          .attr("r", 7)
          .style("fill", "#69b3a2")
          .on("mouseover", function (event, d) {
            // Remove any existing tooltip
            d3.select(".tooltip").remove();
      
            // Add tooltip on mouseover
            const tooltip = d3
              .select("body")
              .append("div")
              .attr("class", "tooltip")
              .style("position", "absolute")
              .style("background-color", "white")
              .style("border", "1px solid black")
              .style("padding", "5px")
              .style("border-radius", "5px");
      
            tooltip
              .html(
                `<strong>Month:</strong> ${d.monthName}<br><strong>Passenger Count:</strong> ${d.passenger_count}`
              )
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY - 28 + "px");
          })
          .on("mouseleave", function () {
            // Remove tooltip on mouseleave
            d3.select(".tooltip").remove();
          });
              
      

        // A function that update the chart
        function update(selectedGroup) {
          // Create new data with the selection?
          const dataFilter = data[selectedGroup];
          // Give these new data to update line
          line
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr(
              "d",
              d3
                .line()
                .x((d) => x(d.monthName))
                .y((d) => y(d.passenger_count))
            );
          dot
            .data(dataFilter)
            .transition()
            .duration(1000)
            .attr("cx", (d) => x(d.monthName))
            .attr("cy", (d) => y(d.passenger_count));
        }

        // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function (event, d) {
          // recover the option that has been chosen
          let selectedOption = d3.select(this).property("value");
          // run the updateChart function with this selected option
          console.log("selected option", selectedOption);
          update(selectedOption);
        });
      }
    };
  }, [peakMonths]);

  return (
    <div>
      <select id="selectButton" style={{color:'black', backgroundColor:'bisque'}}></select>
      <svg ref={svgRef} />
    </div>
  );
}