"use strict";

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", {
    method: "GET",
    mode: "cors"
  })
  .then(data => {
    const gdpData = Object.assign({}, data);
    console.log(gdpData);
    const dates:Date[] = [];
    for (const elem of gdpData["data"]) {
      dates.push(new Date(elem[0]));
    }

    const barWidth:number = 5;
    const svgHeight:number = 600;
    const padding: number = 40;
    const svgWidth:number = (barWidth * gdpData["data"].length) + dates[0].toString().length + 60;
    const container = d3.select("#bar-chart")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("x", 0)
      .attr("y", 0)
    ;

    const xMax:Date = d3.max(dates);
    xMax.setMonth(xMax.getMonth() + 3);
    const xScale = d3.scaleTime()
      .domain([d3.min(dates), xMax])
      .range([padding, svgWidth - padding]);
    const yScale = d3.scaleLinear()
      .domain([0, gdpData["data"][gdpData["data"].length - 1][1]])
      .range([svgHeight - padding, padding]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    container.selectAll("rect")
      .data(gdpData["data"])
      .enter()
      .append("rect")
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("x", (d, i) => {
        if (i !== (gdpData["data"].length - 1)) {
          return xScale(dates[i]);
        }
        return xScale(dates[i]) - barWidth;
      })
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
