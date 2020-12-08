"use strict";

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", {
  method: "GET",
  mode: "cors"
})
  .then(response => {
    if (response.status >= 200 && response.status < 400) {
      return response.json();
    }
  })
  .then(data => {
    const dates = [];
    for (const elem of data.data) {
      dates.push(new Date(elem[0]));
    }

    const barWidth = 5;
    const svgWidth = (barWidth * data.data.length) + dates[0].toString().length + 60;
    const svgHeight = 600;
    const padding = 40;
    const container = d3.select("#bar-chart")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("x", 0)
      .attr("y", 0)
    ;

    const xMax = d3.max(dates);
    xMax.setMonth(xMax.getMonth() + 3);
    const xScale = d3.scaleTime();
    xScale.domain([d3.min(dates), xMax]);
    xScale.range([padding, svgWidth - padding]);
    const yScale = d3.scaleLinear();
    yScale.domain([0, data.data[data.data.length - 1][1]]);
    yScale.range([svgHeight - padding, padding]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    container.selectAll("rect")
      .data(data.data)
      .enter()
      .append("rect")
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("x", (d, i) => xScale(dates[i]))
      .attr("y", d => (svgHeight - ((svgHeight - yScale(d[1])) - padding) - padding))
      .attr("width", barWidth)
      .attr("height", d => (svgHeight - yScale(d[1])) - padding)
      .attr("class", "bar")
    ;

    container.append("g")
      .attr("transform", `translate(0, ${svgHeight - padding})`)
      .attr("id", "x-axis")
      .call(xAxis)
    ;

    container.append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .attr("id", "y-axis")
      .call(yAxis)
    ;
  })
  .catch(error => console.log(error))
;
