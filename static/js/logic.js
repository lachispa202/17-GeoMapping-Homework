// Creating our initial map object

// L.map accepts 2 arguments: id of the HTML element to insert the map, and an object containing the initial options for the new map
var myMap = L.map("mapid", {
    center: [40, -95],
    zoom: 5
});

// Adding a tile layer (the background map image) to our map.
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Selectable backgrounds of our map - tile layers:

// satellite background.
// https://api.mapbox.com/styles/v1/mapbox/light-v10.html?title=true&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA#1.07/0/0

// grayscale background.
// https://api.mapbox.com/styles/v1/mapbox/outdoors-v11.html?title=true&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA#2/20/0

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Add a marker to the map for each earthquake

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function (response) {

    console.log(response);

    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: .5,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Define the color of the marker based on the magnitude of the earthquake.
    function getColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "red";
            case magnitude > 4:
                return "green";
            case magnitude > 3:
                return "blue";
            case magnitude > 2:
                return "orange";
            case magnitude > 1:
                return "yellow";
            default:
                return "white";
        }
    }

    // This function determines the radius of the earthquake marker based on its magnitude.
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 4;
    }

    // Here we add a GeoJSON layer to the map once the file is loaded.
    L.geoJson(response, {
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        // We set the style for each circleMarker using our styleInfo function.
        style: styleInfo,
        // We create a popup for each marker to display the magnitude and location 
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(myMap);


    // Here we create a legend control object.
    var legend = L.control({
        position: "bottomright"
    });

    // Then add all the details for the legend
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");

        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
            "white",
            "yellow",
            "orange",
            "blue",
            "green",
            "red"
        ];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };


    // Add legen to the map
    legend.addTo(myMap)



});




