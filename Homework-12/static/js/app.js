function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    panel = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    url = 'http://127.0.0.1:5000/metadata/'+sample;
    // console.log(url)

    d3.json(url).then(function(data) {
      Object.entries(data).forEach(([key, value])=> {
      // console.log(`${key}: ${value}`))
      panel.append('h6').text(`${key}: ${value}`);
      });
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  url = 'http://127.0.0.1:5000/samples/'+sample;
  
  d3.json(url).then(function(data) {

    var otu_ids = data.otu_ids;
    var sample_values = data.sample_values;
    var otu_labels = data.otu_labels;
    
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker : {
        size: sample_values,
        color: otu_ids,
        colorscale: "Portland",
      }
      
    }

    var data1 = [trace1];

    var layout1 = {
      title: {
      text: `Bubble Chart for Sample ${sample}`,
      font: {
        size: 24
      }},
      height: 600,
      width: 1600,
      margin: {
        l: 200,
        r: 200,
      },
      xaxis: {
        title: "Operational Taxonomical Units (OTU)",
      },
      yaxis: {
        title: "OTU Frequency",
      },
    }

    Plotly.newPlot('bubble', data1, layout1)
    
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    data.sample_values.sort((a,b) => parseFloat(b) - parseFloat(a));
  
    trace2 = {
      values: data.sample_values.slice(0,10),
      labels: data.otu_ids.slice(0,10),
      hovertext: data.otu_labels.slice(0,10),
      type: 'pie',
    }

    var data2 = [trace2];
    
    var layout2 = {
      title: `Pie Chart for Sample ${sample}`
    }

    Plotly.newPlot('pie', data2, layout2)
  
  


  });

  
    






}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
