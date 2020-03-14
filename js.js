window.onload = () => {
    let map;

    let initialView = [44.58655513209545, -84.759521484375];

    let mapBounds = [
        [40.9882, -92.417],
        [48.9008, -80.2222]
    ]

    let confirmedCases = [{
        1: { "county": "Bay", "cases": "1" },
        2: { "county": "Charlevoix", "cases": "1" },
        3: { "county": "Ingham", "cases": "1" },
        4: { "county": "Kent", "cases": "3" },
        5: { "county": "Montcalm", "cases": "1" },
        6: { "county": "Oakland", "cases": "6" },
        7: { "county": "St. Clair", "cases": "1" },
        8: { "county": "Washtenaw", "cases": "3" },
        9: { "county": "Wayne", "cases": "6" },
        10: { "county": "Unknown", "cases": "2" },
    }]

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
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> Michigan Department of Health and Human Services - 3/13/2020 - 8:59 p.m.',
            subdomains: "abcd",
            maxZoom: 13,
            minZoom: 7
        }
    ).addTo(map);

    L.esri.featureLayer({
        url: 'https://services9.arcgis.com/6EuFgO4fLTqfNOhu/arcgis/rest/services/Counties_v17a/FeatureServer/0',
        style: {
            "fillOpacity": 0,
            "color": "gray",
            "weight": 1,
            "opacity": 1,
            "dashArray": '5, 5'
        }
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


    //Full Extent of map button
    let homeButton = L.easyButton({
        states: [{
            stateName: "home",
            icon: "fa-home text-primary",
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

    //Table
    function onEachFeaturePolygon(feature, layer) {
        for (let i = 1; i <= 10; i++) {
            if (confirmedCases[0][i].county === feature.properties.NAME) {
                layer.bindPopup(`
                County: ${feature.properties.NAME}<br>
                Cases: ${confirmedCases[0][i].cases}
                `);
            }
        }
    }

    let confirmedCasesLayer =
        L.esri.featureLayer({
            url: 'https://services9.arcgis.com/6EuFgO4fLTqfNOhu/arcgis/rest/services/Counties_v17a/FeatureServer/0',
            onEachFeature: onEachFeaturePolygon,
            style: function(feature) {
                //Needs refactored
                if (feature.properties.NAME === 'Bay' || feature.properties.NAME === 'Charlevoix' || feature.properties.NAME === 'Ingham' || feature.properties.NAME === 'Kent' ||
                    feature.properties.NAME === 'Montcalm' || feature.properties.NAME === 'Oakland' || feature.properties.NAME === 'St. Clair' || feature.properties.NAME === 'Washtenaw' ||
                    feature.properties.NAME === 'Wayne')
                    return {
                        fillOpacity: 0.35,
                        fillColor: "yellow",
                        weight: 1.0,
                        color: "gray"
                    }
                else {
                    return {
                        "fillOpacity": 0,
                        "color": "gray",
                        "weight": 1,
                        "opacity": 1,
                        "dashArray": '5, 5'
                    }
                }
            }
        }).addTo(map);

    for (let i = 1; i <= 10; i++) {
        console.log(confirmedCases[0][i])
        $('#table').append(
            `<tr>
        <td>${confirmedCases[0][i].county}</td>
        <td>${confirmedCases[0][i].cases}</td>
         </tr>`)
        $(".nano").nanoScroller()
        $(".nano-pane").css("display", "block");
        $(".nano-slider").css("display", "block");
    }
}