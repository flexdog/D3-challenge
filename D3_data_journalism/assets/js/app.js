

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart and shift the latter by left and top margins
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("../data/data.csv").then(function(stateData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================


  // Format the data
  stateData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.povertyMoe = +data.povertyMoe;
    data.age = +data.age;
    data.ageMoe = +data.ageMoe;
    data.income = +data.income;
    data.incomeMoe = +data.incomeMoe;
    data.healthcare = +data.healthcare;
    data.healthcareLow = +data.healthcareLow;
    data.healthcareHigh = +data.healthcareHigh;
    data.obesity = +data.obesity;
    data.obesityLow = +data.obesityLow;
    data.obesityHigh = +data.obesityHigh;
    data.smokes = +data.smokes;
    data.smokesLow = +data.smokesLow;
    data.smokesHigh = +data.smokesHigh;
  });

// Create scale functions
var xLinearScale = d3.scaleLinear()
  .domain(d3.extent(stateData, d => d.age))
  .range([0, width]);

var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(stateData, d => d.poverty)])
  .range([height, 0]);

// Create axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Append axes to the chart
chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

chartGroup.append("g")
  .call(leftAxis);

// Create circles
var circlesGroup = chartGroup.selectAll("Circle")
  .data(stateData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.age))
  .attr("cy", d => yLinearScale(d.poverty))
  .attr("r", "15")
  .attr("fill", "blue")
  .attr("opacity", "0.5");

var circleLabels = chartGroup.selectAll(null).data(stateData).enter().append("text");

circleLabels
  .attr("x", function(d) {
    return xLinearScale(d.age);
  })
  .attr("y", function(d) {
    return yLinearScale(d.poverty);
  })
  .text(function(d) {
    return d.abbr;
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", "12px")
  .attr("text-anchor", "middle")
  .attr("fill", "white");

// Create axes labels
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Poverty Rate");

chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .attr("class", "axisText")
  .text("Age");
    
}).catch(function(error) {
    console.log(error);
})