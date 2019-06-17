
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
var faultsUrl = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json'

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});




function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + "Magnitude " + feature.properties.mag + "<br>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function pointToLayer(feature, latlng) {
  	return L.circleMarker(latlng, {
  		  	radius: scaleRadius(feature.properties.mag),
  			fillColor: getColor(feature.properties.mag),
  			fillOpacity: 0.7,
  			weight: .5,
  			color: 'black'
  	})
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
  	pointToLayer: pointToLayer,
    onEachFeature: onEachFeature
  });



  d3.json(faultsUrl, function(data) {

  	var faults = L.geoJSON(data.features, {
  		fillOpacity: 0,
  	})

  	createMap(earthquakes, faults);

  })
  
}


function createMap(earthquakes, faults) {

  // Define streetmap and darkmap layers
  var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
    id: "mapbox.sat",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
	maxZoon: 18,
	id: 'mapbox.street',
	accessToken: API_KEY
	});

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satelite": Esri_WorldImagery,
    "Street Map": Esri_WorldStreetMap,
    "Dark Map": darkmap
  };


  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    'Earthquakes': earthquakes,
    'Fault Lines': faults

  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var map = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [Esri_WorldImagery, earthquakes, faults]
  });

//add legend
  var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
    	labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
	};

	legend.addTo(map);



  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}


function getColor(d) {
    return d > 5 ? '#800026' :
           d > 4 ? '#BD0026' :
           d > 3 ? '#E31A1C' :
           d > 2 ? '#FC4E2A' :
           d > 1 ? '#FD8D3C' :
				   '#FFEDA0';
}

function scaleRadius(r) {
	return r*4
}





