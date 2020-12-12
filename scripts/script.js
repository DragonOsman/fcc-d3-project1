"use strict";

const state = {
  data: []
};

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", {
    method: "GET",
    mode: "cors"
  })
  .then(data => {
    state.data = data.data;
    const dates = [];
    for (const elem of state.data) {
      dates.push(new Date(elem[0]));
    }

    for (const date of dates) {
      date.setMonth(date.getMonth() + 1);
    }

    const barWidth = 5;
    const svgHeight = 600;
    const padding = 40;
    const svgWidth = (barWidth * state.data.length) + dates[0].toString().length + 60;
    const container = d3.select("#bar-chart")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("x", 0)
      .attr("y", 0)
    ;

    const xMax = d3.max(dates);
    xMax.setMonth(xMax.getMonth() + 3);
    const xScale = d3.scaleTime()
      .domain([d3.min(dates), xMax])
      .range([padding, svgWidth - padding]);
    const yScale = d3.scaleLinear()
      .domain([0, state.data[state.data.length - 1][1]])
      .range([svgHeight - padding, padding]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const tooltip = d3.select(".tooltip-container")
      .append("div")
      .attr("id", "tooltip")
      .attr("class", "tooltip")
      .style("opacity", 0)
    ;

    const overlay = d3.select(".tooltip-container")
      .append("div")
      .attr("class", "overlay")
      .style("opacity", 0)
    ;

    container.selectAll("rect")
      .data(state.data)
      .enter()
      .append("rect")
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("x", (d, i) => {
        if (i !== (state.data.length - 1)) {
          return xScale(dates[i]);
        }
        return xScale(dates[i]) - barWidth;
      })
      .attr("y", d => (svgHeight - ((svgHeight - yScale(d[1])) - padding) - padding))
      .attr("width", barWidth)
      .attr("height", d => (svgHeight - yScale(d[1])) - padding)
      .attr("class", "bar")
      .on("mouseover", (e, d) => {
        overlay.transition()
          .duration(0)
          .style("opacity", 0.9)
          .attr("height", `${barWidth + 2}px`)
          .attr("width", `${barWidth + 2}px`)
          .style("left", `${e.pageX}px`)
          .style("top", `${e.pageY - 28}px`)
          .style("transform", "translateX(55px)")
        ;

        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9)
        ;
         
        tooltip.html(
          `${d[0]}
          <br />(format: yyyy-mm-dd)
          <br />$${d[1].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")} Billion`
        )
          .attr("data-date", d[0])
          .style("left", `${e.pageX}px`)
          .style("top", `${e.pageY - 28}px`)
          .style("transform", "translateX(55px)")
        ;
      })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0)
        ;

        overlay.transition()
          .duration(200)
          .style("opacity", 0)
        ;
      })
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
