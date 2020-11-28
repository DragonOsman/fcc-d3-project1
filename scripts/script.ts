"use strict";

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  {
    method: "GET",
    mode: "cors"
  }
)
  .then(response => {
    if (response.status >= 200 && response.status < 400) {
      return response.json();
    }
  })
  .then(data => {
    const gdpData:any[] = [...data.data];
    const dates:string[] = [];
    for (const elem of gdpData) {
      dates.push(`${new Date(elem[0]).getMonth() + 1}-${new Date(elem[0]).getDate()}-${new Date(elem[0]).getFullYear()}`);
    }

    const svgWidth: number = (data.data.length * dates[0].length) * 10;
    const svgHeight: number = 500;
    const padding: number = 50;
    const container = d3.select("#bar-chart")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("x", 0)
      .attr("y", 0)
    ;

    const xScale:d3.ScaleBand<string> = d3.scaleBand();
    xScale.domain(dates);
    xScale.range([padding, svgWidth - padding]);
    const yScale:d3.ScaleLinear<number, number, never> = d3.scaleLinear();
    yScale.domain([0, 19000]);
    yScale.range([svgHeight - padding, padding]);

    const xAxis:d3.Axis<string> = d3.axisBottom(xScale);
    const yAxis:d3.Axis<d3.NumberValue> = d3.axisLeft(yScale);

    container.selectAll("rect")
      .data(gdpData)
      .enter()
      .append("rect")
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("x", (d, i) => i * 23)
      .attr("y", d => svgHeight - d[1] - padding) // height of SVG canvas - bar height - padding
      .attr("width", 20)
      .attr("height", d => d[1])
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
