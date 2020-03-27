window.onload = () => {
    let map;

    let initialView = [44.58655513209545, -84.759521484375];

    let mapBounds = [
        [40.9882, -92.417],
        [48.9008, -80.2222]
    ]

    let cases = [];

    let confirmedCases = [{
        1: { "county": "Allegan", "cases": "1", "deaths": "0" },
        2: { "county": "Barry", "cases": "1", "deaths": "0" },
        3: { "county": "Bay", "cases": "4", "deaths": "0" },
        4: { "county": "Berrien", "cases": "11", "deaths": "0" },
        5: { "county": "Calhoun", "cases": "7", "deaths": "0" },
        6: { "county": "Cass", "cases": "1", "deaths": "0" },
        7: { "county": "Charlevoix", "cases": "4", "deaths": "0" },
        8: { "county": "Clare", "cases": "1", "deaths": "0" },
        9: { "county": "Clinton", "cases": "7", "deaths": "0" },
        10: { "county": "Eaton", "cases": "4", "deaths": "0" },
        11: { "county": "Emmet", "cases": "2", "deaths": "0" },
        12: { "county": "Genesee", "cases": "63", "deaths": "1" },
        13: { "county": "Gladwin", "cases": "2", "deaths": "0" },
        14: { "county": "Grand Traverse", "cases": "3", "deaths": "0" },
        15: { "county": "Hillsdale", "cases": "5", "deaths": "0" },
        16: { "county": "Ingham", "cases": "22", "deaths": "0" },
        17: { "county": "Ionia", "cases": "2", "deaths": "0" },
        18: { "county": "Iosco", "cases": "1", "deaths": "0" },
        19: { "county": "Isabella", "cases": "3", "deaths": "0" },
        20: { "county": "Jackson", "cases": "17", "deaths": "0" },
        21: { "county": "Kalamazoo", "cases": "10", "deaths": "0" },
        22: { "county": "Kalkaska", "cases": "2", "deaths": "0" },
        23: { "county": "Kent", "cases": "41", "deaths": "1" },
        24: { "county": "Lapeer", "cases": "3", "deaths": "0" },
        25: { "county": "Leelanau", "cases": "1", "deaths": "0" },
        26: { "county": "Lenawee", "cases": "5", "deaths": "0" },
        27: { "county": "Livingston", "cases": "21", "deaths": "1" },
        28: { "county": "Macomb", "cases": "347", "deaths": "11" },
        29: { "county": "Manistee", "cases": "1", "deaths": "0" },
        30: { "county": "Marquette", "cases": "1", "deaths": "0" },
        31: { "county": "Mecosta", "cases": "1", "deaths": "1" },
        32: { "county": "Midland", "cases": "6", "deaths": "0" },
        33: { "county": "Missaukee", "cases": "1", "deaths": "0" },
        34: { "county": "Monroe", "cases": "21", "deaths": "0" },
        35: { "county": "Montcalm", "cases": "3", "deaths": "0" },
        36: { "county": "Muskegon", "cases": "3", "deaths": "0" },
        37: { "county": "Newaygo", "cases": "1", "deaths": "0" },
        38: { "county": "Oakland", "cases": "668", "deaths": "15" },
        39: { "county": "Oceana", "cases": "1", "deaths": "0" },
        40: { "county": "Ogemaw", "cases": "1", "deaths": "0" },
        41: { "county": "Otsego", "cases": "7", "deaths": "0" },
        42: { "county": "Ottawa", "cases": "18", "deaths": "0" },
        43: { "county": "Roscommon", "cases": "1", "deaths": "0" },
        44: { "county": "Saginaw", "cases": "10", "deaths": "0" },
        45: { "county": "Sanilac", "cases": "1", "deaths": "0" },
        46: { "county": "Shiawassee", "cases": "1", "deaths": "0" },
        47: { "county": "St. Clair", "cases": "13", "deaths": "0" },
        48: { "county": "Tuscola", "cases": "2", "deaths": "1" },
        49: { "county": "Van Buren", "cases": "2", "deaths": "0" },
        50: { "county": "Washtenaw", "cases": "92", "deaths": "3" },
        51: { "county": "Wayne", "cases": "1389", "deaths": "26" },
        52: { "county": "Wexford", "cases": "1", "deaths": "0" },
        53: { "county": "Other", "cases": "13", "deaths": "0" },
        54: { "county": "Out of State", "cases": "7", "deaths": "0" },

    }]


    $.each(confirmedCases, function(key, value) {
        $.each(value, function(key, value) {
            cases.push(value.county)
        })
    })

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
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> Michigan Department of Health and Human Services - 3/26/2020 - 2:03 p.m.',
            subdomains: "abcd",
            maxZoom: 13,
            minZoom: 7
        }
    ).addTo(map);

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
        for (let i = 1; i < cases.length; i++) {
            if (confirmedCases[0][i].county === feature.properties.NAME) {
                layer.bindTooltip(`
                County: ${feature.properties.NAME}<br>
                Cases: ${confirmedCases[0][i].cases}
                Deaths: ${confirmedCases[0][i].deaths}
                `);
            }
        }
    }


    let confirmedCasesLayer =
        L.esri.featureLayer({
            url: 'https://services9.arcgis.com/6EuFgO4fLTqfNOhu/arcgis/rest/services/Counties_v17a/FeatureServer/0',
            onEachFeature: onEachFeaturePolygon,
            style: function(feature) {
                if (feature.properties.color === 'Yellow') {
                    return {
                        fillOpacity: 0.35,
                        fillColor: "yellow",
                        weight: 1.0,
                        color: "gray"
                    };
                } else if (feature.properties.color === 'Orange') {
                    return {
                        fillOpacity: 0.35,
                        fillColor: "orange",
                        weight: 1.0,
                        color: "gray"
                    }
                } else {
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

    for (let i = 1; i <= cases.length; i++) {
        $('#table').append(
            `<tr>
        <td>${confirmedCases[0][i].county}</td>
        <td>${confirmedCases[0][i].cases}</td>
        <td>${confirmedCases[0][i].deaths}</td>
         </tr>`)
        $(".nano").nanoScroller()
        $(".nano-pane").css("display", "block");
        $(".nano-slider").css("display", "block");
    }
}