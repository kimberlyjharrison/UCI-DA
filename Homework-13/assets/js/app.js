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

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

 var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv('assets/data/data.csv')
  .then(function(healthData) {

	healthData.forEach(function(data) {
		data.poverty = +data.poverty;
		data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.abbr = data.abbr
	});


	var xLinearScale = d3.scaleLinear()
		.domain([8, d3.max(healthData, d=>d.poverty)])
		.range([0, width])

	var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(healthData, d => d.healthcare)])
      .range([height, 0]);

  var bottomAxis = d3.axisBottom(xLinearScale);

  var leftAxis = d3.axisLeft(yLinearScale);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .classed('stateCircle', true)
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")

  var stateLabels = chartGroup.selectAll(".stateText")
    .data(healthData)
    .enter()
    .append('text')
    .classed("stateText", true)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare)+4)
    .attr('font-size', '10px')
    .text(d => d.abbr);


  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .attr('opacity', '.9')
    .offset([80, -60])
    .html(function(d) {
      return (`<strong>${d.state}</strong><br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
    });

  chartGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
  })

  .on("mouseout", function(data, index) {
      toolTip.hide(data);
  });

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Poverty (%)");

});