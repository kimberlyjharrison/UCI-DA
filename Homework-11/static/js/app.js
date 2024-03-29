// from data.js
var tableData = data;

// assign variable to buttons
var submit = d3.select("#filter-btn");
var clearTable = d3.select('#clear-btn');
var loadAll = d3.select("#loadall-btn");

// assign variable to table body element
var tbody = d3.select('tbody');

// create search criteria value; default to datetime
var searchCrit = 'datetime';

// store search criteria from dropdown menu
function reply_click(clicked_id)
{
	searchCrit = clicked_id;
	return(searchCrit);
}

//show selected item from dropdown menu
$(function(){
    $(".dropdown-menu").on('click', 'li', function(){
      $(".btn:first-child").text($(this).text());
      $(".btn:first-child").val($(this).text());
   });

});

// create event handler for button click to filter data
submit.on('click', function() {
	
	//prevent refresh
	d3.event.preventDefault();
	
	//clear previous table data if it exists
	d3.selectAll('td').remove()

	// select input element/test from input field
	var inputElement = d3.select('#inputfield');
	var inputValue = inputElement.property('value').toLowerCase();

	//filter data based on search criteria and value
	if (searchCrit === 'datetime') {
		var filteredData = tableData.filter(inputDate => inputDate.datetime === inputValue);
	}
	else if (searchCrit === 'state') {
		var filteredData = tableData.filter(inputDate => inputDate.state === inputValue);
	}
	else if (searchCrit === 'city') {
		var filteredData = tableData.filter(inputDate => inputDate.city === inputValue);
	}
	else if (searchCrit === 'country') {
		var filteredData = tableData.filter(inputDate => inputDate.country === inputValue);
	}
	else if (searchCrit === 'shape') {
		var filteredData = tableData.filter(inputDate => inputDate.shape === inputValue);
	}
	else{
		console.log('invalid search criteria');
	}


	//check if any data was found for input value
	if (filteredData.length > 0) {
		//append table with data that matches filter criteria
		filteredData.forEach((tableFilter) => {
			var row = tbody.append('tr');
			Object.entries(tableFilter).forEach(([key, value]) => {
				var cell = row.append('td');
				cell.text(value);
			});
		});
	}
	//return "no data found" statement
	else {
		var row = tbody.append('tr');
		var cell = row.append('td');
		cell.text('No data found for that criteria.');
	}
});

//load all data into table
loadAll.on('click', function() {
	d3.event.preventDefault();
	var inputElement = d3.select('#datetime');
	var inputValue = inputElement.property('value');

	tableData.forEach((loadAllData) => {
		var row = tbody.append('tr');
		Object.entries(loadAllData).forEach(([key, value]) => {
			var cell = row.append('td');
			cell.text(value);
		});
	});
});

// add button to clear table by removing all previous data
clearTable.on('click', function() {
	d3.event.preventDefault();
	d3.selectAll('td').remove()
	console.log('table clear');
})


