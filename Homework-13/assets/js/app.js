//K. Harrison
//Homework 13

//set initial chart paramenters
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 160,
  left: 200
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


//declare and initialize x-axis and y-axis
var chosenXAxis = "poverty";
var chosenYAxis = 'healthcare';

//create fucntion to scale x-axis based on min and max values from csv data
function xScale(healthData, chosenXAxis) {

  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d=>d[chosenXAxis]) * 1.2])
    .range([0, width])

    return xLinearScale
}

//create fucntion to scale y-axis based on min and max values from csv data
function yScale(healthData, chosenYAxis) {

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
      d3.max(healthData, d=>d[chosenYAxis]) * 1.2])
    .range([height, 0])

    return yLinearScale
}

//create function to render new x-axis when user clicks on new axis
function renderAxesX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

//create function to render new y-axis when user clicks on new axis
function renderAxesY(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

//create function to render circles based on data when user clicks new axis
function renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr('cy', d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

//create function to render state labels inside of cicles when user clicks new axis
function renderLabels(stateLabels, newXScale, chosenXaxis, newYScale, chosenYAxis) {
  
  stateLabels.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr('y', d => newYScale(d[chosenYAxis])+4);

  return stateLabels;
}

//update tool tip values 
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  //x-axis labels
  if (chosenXAxis === "poverty") {
    var xlabel = "Poverty (%): ";
  }
  else if (chosenXAxis === "age") {
    var xlabel = "Median Age: ";
  }
  else {
    var xlabel = "Median Income: ";
  }

  //y-axis labels
  if (chosenYAxis === "healthcare") {
    var ylabel = "Healthcare (%): ";
  }
  else if (chosenYAxis === "smokes") {
    var ylabel = "Smokers (%): ";
  } 
  else {
    var ylabel = "Obesity (%): ";
  }

  //initialize tooltip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .attr('opacity', '.9')
    .offset([80, -60])
    .html(function(d) {
      return (`<strong>${d.state}</strong><br>${xlabel}${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}`);
    });

  //call tooltip
  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}


// Import Data
d3.csv('assets/data/data.csv').then(function(healthData) {

  //prase data
	healthData.forEach(function(data) {
		data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
		data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.abbr = data.abbr
	});

  //scale x- and y-axis
  var xLinearScale = xScale(healthData, chosenXAxis);
  var yLinearScale = yScale(healthData, chosenYAxis);

  //create bottom and left axis lines based on scaling
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  //append x-axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  //apend y-axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  //create initial cirlces
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .classed('stateCircle', true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "10");

  //create initial state labels
  var stateLabels = chartGroup.selectAll(".stateText")
    .data(healthData)
    .enter()
    .append('text')
    .classed("stateText", true)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis])+4)
    .attr('font-size', '10px')
    .text(d => d.abbr);

  //update tool tip
  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  //create x-axis labels group
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);
 
  // create x-axis labels
  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income ($, Median)");

  //create y-axis labels group
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(0, ${height / 2})`);

  //create y-axis labels
  var healthcareLabel = ylabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 0-30)
    .attr("value", "healthcare") // value to grab for event listener
    .attr('transform', 'rotate(-90)')
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  var smokesLabel = ylabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 0 - 50)
    .attr("value", "smokes") // value to grab for event listener
    .attr('transform', 'rotate(-90)')
    .classed("inactive", true)
    .text("Smokes (%)");

  var obeseLabel = ylabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 0-70)
    .attr("value", "obesity") // value to grab for event listener
    .attr('transform', 'rotate(-90)')
    .classed("inactive", true)
    .text("Obese (%)");


  //change x-axis and all data upon clicking new axis
  xlabelsGroup.selectAll("text")
    .on('click', function() {
      var value = d3.select(this).attr('value');

      if (value != chosenXAxis) { //initiate change if x-axis is not chosenXAxis

        //set new x-axis value
        chosenXAxis = value;

        //create x linear scale
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxesX(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update state labels in circles with new x-values
        stateLabels = renderLabels(stateLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        //activate appropriate x-axis label
        if (chosenXAxis === "poverty") {
          povertyLabel.classed("active", true).classed("inactive", false);
          incomeLabel.classed("active", false).classed("inactive", true);
          ageLabel.classed("active", false).classed("inactive", true);
        }
        else if (chosenXAxis === "income") {
          povertyLabel.classed("active", false).classed("inactive", true);
          incomeLabel.classed("active", true).classed("inactive", false);
          ageLabel.classed("active", false).classed("inactive", true);
        }
        else {
          povertyLabel.classed("active", false).classed("inactive", true);
          incomeLabel.classed("active", false).classed("inactive", true);
          ageLabel.classed("active", true).classed("inactive", false);
        }
      }
    });

  //change y-axis and all data upon clicking new axis
  ylabelsGroup.selectAll("text")
    .on('click', function() {
      var value = d3.select(this).attr('value');
      if (value !== chosenYAxis) {

        //set new y-axis value
        chosenYAxis = value;
        
        //create y linear scale
        yLinearScale = yScale(healthData, chosenYAxis);

        // update y-axis with transition
        yAxis = renderAxesY(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        stateLabels = renderLabels(stateLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        //activate appropriate y-axis
        if (chosenYAxis === "healthcare") {
          healthcareLabel.classed("active", true).classed("inactive", false);
          smokesLabel.classed("active", false).classed("inactive", true);
          obeseLabel.classed("active", false).classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {
          healthcareLabel.classed("active", false).classed("inactive", true);
          smokesLabel.classed("active", true).classed("inactive", false);
          obeseLabel.classed("active", false).classed("inactive", true);
        }
        else {
          healthcareLabel.classed("active", false).classed("inactive", true);
          smokesLabel.classed("active", false).classed("inactive", true);
          obeseLabel.classed("active", true).classed("inactive", false);
        }
      }
    });
  });
