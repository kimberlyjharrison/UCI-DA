// from data.js
var tableData = data;

// assign variable to filter table button
var submit = d3.select("#filter-btn");

// assign variable to table body element
var tbody = d3.select('tbody');

// create event handler for button click to filter data
submit.on('click', function() {

	d3.event.preventDefault();

	// select input element/test from input field
	var inputElement = d3.select('#datetime');
	var inputValue = inputElement.property('value');

	//filter data based on input value
	var filteredData = tableData.filter(inputDate => inputDate.datetime === inputValue);

	//append table with data that matches filter criteria
	filteredData.forEach((tableFilter) => {
		var row = tbody.append('tr');
		Object.entries(tableFilter).forEach(([key, value]) => {
			var cell = row.append('td');
			cell.text(value);
		});
	});
});

