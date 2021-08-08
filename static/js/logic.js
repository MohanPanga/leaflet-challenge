var myMap = L.map("map", {
    center: [36.7783, -119.4179],
    zoom: 5
})

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap)


url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

d3.json(url).then(function (data) {
    console.log(data)
    console.log(data.features.length)

    for (i = 0; i < data.features.length; i++) {
        feature = data.features[i]
        lon = feature.geometry.coordinates[0]
        lat = feature.geometry.coordinates[1]
        depth = feature.geometry.coordinates[2]
        magnitude = feature.properties.mag

        L.circle([lat, lon], {
            radius: magnitude * 20000,
            fillColor: getColor(depth),
            color: "black",
            weight: 0.75,
            fillOpacity: 0.75
        }).bindPopup("<b>"+feature.properties.place+"</b><br>"+`magnitude: ${magnitude} `).addTo(myMap)

    }
    
    var legend = L.control({ position: 'bottomleft' });
    
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            depths = [-10, 10, 20, 50, 100, 200, 500],
            labels = [];

        // loop through depth intervals and generate a label with a colored square for each interval
        div.innerHTML = '<b>Depth Legend</b><br>';
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"> &nbsp &nbsp </i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div;
    };
    function getColor(d) {
        return d > 500 ? '#800026' :
            d > 200 ? '#BD0026' :
                d > 100 ? '#E31A1C' :
                    d > 50 ? '#FC4E2A' :
                        d > 20 ? '#FD8D3C' :
                            d > 10 ? '#FEB24C' :
                                d > -10 ? '#a1d99b' :
                                    '#FFEDA0';
    }
    legend.addTo(myMap);
}
)


