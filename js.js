let map;

let initialView = [44.58655513209545, -84.759521484375];

let mapBounds = [
    [40.9882, -92.417],
    [48.9008, -80.2222]
]

map = L.map("map", {
    zoomControl: false
}).setView(initialView, 7).setMaxBounds(mapBounds);

L.control
    .zoom({
        position: "topright"
    })
    .addTo(map);


//Carto Basemap
var CartoDB_PositronNoLabels = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> Michigan Department of Health and Human Services - 3/13/2020 - 5:44 p.m.',
        subdomains: "abcd",
        maxZoom: 13,
        minZoom: 7
    }
).addTo(map);


L.esri.featureLayer({
    url: 'https://services9.arcgis.com/6EuFgO4fLTqfNOhu/arcgis/rest/services/Counties_v17a/FeatureServer/0'
}).addTo(map);

//Pop-up Content for Points
function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties) {
        layer.bindPopup(`
        Date: ${feature.properties.Date}<br>
        Time: ${feature.properties.Time}<br>
        Place: ${feature.properties.Place}<br>
        Address: ${feature.properties.Address}<br>
        City: ${feature.properties.City}<br>
        County: ${feature.properties.County}<br>
        `);
    }
}

let pulsingIcon = L.icon.pulse({ iconSize: [10, 10], color: 'red' });

let exposureLocations = L.geoJSON(exposuresJson, {
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, { icon: pulsingIcon });
    },
    onEachFeature: onEachFeature
}).addTo(map);


//Pop-up Content for polygons
function onEachFeaturePolygon(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties) {
        layer.bindPopup(`
        County: ${feature.properties.NAME}<br>
        Cases: ${feature.properties.cases}<br>
        `);
    }
}

var myStyle = {
    "color": "#ffff00",
    "weight": 1,
    "opacity": 0.75,
    "dashArray": '5, 5'
};

let casesLocations = L.geoJSON(cases, {
    onEachFeature: onEachFeaturePolygon,
    style: myStyle
}).addTo(map);



//Full Extent of map button
let homeButton = L.easyButton({
    states: [{
        stateName: "home",
        icon: "fa-home text-danger",
        title: "Full Extent",
        onClick: function(btn, map) {
            map.setView(initialView, 7);
        }
    }],
    position: "topright"
}).addTo(map);


//Zoom to locations on mobile
let bounds = L.latLngBounds(exposureLocations);
if ($(window).width() <= 980) {
    map.fitBounds(exposureLocations.getBounds())
}