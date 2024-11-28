// Initialize the map
let myMap = L.map("map", {
    center: [37.81, -144.96],
    zoom: 3
});

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(myMap);

// Define the color function
function getColor(d) {
    return d > 80 ? 'black' :
           d > 60 ? 'red' :
           d > 40 ? 'orangered' :
           d > 20 ? 'orange' : 'yellow';
}

// Define the magnitude-to-radius function
function magRadius(feature) {
    let magnitude = feature.properties.mag;
    return magnitude ? magnitude * 2 : 1; // Scale the radius, default to 1 if undefined
}

// Fetch and display earthquake data
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson').then(function (data) {
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: function (feature) {
            return {
                fillColor: getColor(feature.geometry.coordinates[2]), // Depth determines color
                weight: 1, // Border thickness
                color: 'black', // Border color
                fillOpacity: 0.8,
                radius: magRadius(feature) // Radius based on magnitude
            };
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "Magnitude: " + feature.properties.mag +
                "<br>Location: " + feature.properties.place +
                "<br>Depth: " + feature.geometry.coordinates[2]
            );
        }
    }).addTo(myMap);

    // Add the legend after the data has been added
    legend.addTo(myMap);
});

// Create the legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    var depth = [0, 20, 40, 60, 80]; // Depth ranges matching getColor logic

    // Loop through depth intervals and generate labels with colored squares
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depth[i] + 1) + '; width: 18px; height: 18px; display: inline-block;"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
};

// Add the legend to the map
legend.addTo(myMap);

// Add a title control
var title = L.control({ position: "topleft" });

title.onAdd = function (map) {
    var div = L.DomUtil.create("div", "map-title");
    div.innerHTML = "<h2>ALL Earthquakes in the last 30 days</h2>";
    return div;
};

// Add the title to the map
title.addTo(myMap);

