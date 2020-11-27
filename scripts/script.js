"use strict";
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", {
    method: "GET",
    mode: "cors"
})
    .then(response => {
    if (response.ok) {
        return response.json();
    }
})
    .then(data => {
    const svgWidth = 13000;
    const svgHeight = 500;
    const padding = 50;
    const container = d3.select("#bar-chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("x", 0)
        .attr("y", 0);
    const dates = [];
    for (const elem of data.data) {
        dates.push(`${new Date(elem[0]).getMonth() + 1}-${new Date(elem[0]).getDate()}-${new Date(elem[0]).getFullYear()}`);
    }
    const xScale = d3.scaleBand();
    xScale.domain(dates);
    console.log(xScale);
    xScale.range([padding, svgWidth - padding]);
    const yScale = d3.scaleLinear();
    yScale.domain([0, 19000]);
    console.log(yScale);
    yScale.range([svgHeight - padding, padding]);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    container.append("g")
        .attr("transform", `translate(0, ${svgHeight - padding})`)
        .attr("id", "x-axis")
        .call(xAxis);
    container.append("g")
        .attr("transform", `translate(${padding}, 0)`)
        .attr("id", "y-axis")
        .call(yAxis);
})
    .catch(error => console.log(error));
