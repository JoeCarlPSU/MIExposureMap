let map;

let initialView = [44.58655513209545, -84.759521484375];

map = L.map("map", {
    zoomControl: false
}).setView(initialView, 7);

L.control
    .zoom({
        position: "topright"
    })
    .addTo(map);

var CartoDB_PositronNoLabels = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> Michigan Department of Health and Human Services - 3/13/2020',
        subdomains: "abcd",
        maxZoom: 19
    }
).addTo(map);

// var geojsonLayer = L.geoJSON(exposuresJson);
// geojsonLayer.addTo(map);


// var geojsonMarkerOptions = {
//     radius: 5,
//     fillColor: "#800000",
//     color: "#000",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.8
// };

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
        `);
    }
}

var pulsingIcon = L.icon.pulse({ iconSize: [10, 10], color: 'red' });

L.geoJSON(exposuresJson, {
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, { icon: pulsingIcon });
    },
    onEachFeature: onEachFeature
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