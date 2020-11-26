import * as d3 from "d3";
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", {
    method: "GET",
    credentials: "include",
    headers: {
        "Content-Type": "application/json"
    }
})
    .then(response => {
    if (response.status >= 200 && response.status < 500) {
        return response.json();
    }
})
    .then(data => {
    const svgWidth = 700;
    const svgHeight = 200;
    const container = d3.select("#bar-chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("x", 0)
        .attr("y", 0);
    console.log(data);
    container.append("g");
    // const gdpData = data.data;
})
    .catch(error => console.log(error));
