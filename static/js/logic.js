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
    circles = []
    for (i = 0; i < data.features.length; i++) {
        feature = data.features[i]
        lon = feature.geometry.coordinates[0]
        lat = feature.geometry.coordinates[1]
        depth = feature.geometry.coordinates[2]
        magnitude = feature.properties.mag

        L.circle([lat, lon], {
            radius: magnitude * 10000,
            fillColor: getColor(depth)
        }).bindPopup(feature.properties.place + `${depth}`).addTo(myMap)
        // console.log(lon,lat,depth)
        // circle = L.cirle
        // circles.push(feature)
    }
    var legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"> &nbsp </i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };
    function getColor(d) {
        return d > 1000 ? '#800026' :
            d > 500 ? '#BD0026' :
                d > 200 ? '#E31A1C' :
                    d > 100 ? '#FC4E2A' :
                        d > 50 ? '#FD8D3C' :
                            d > 20 ? '#FEB24C' :
                                d > -10 ? '#edf8b1':
                                    '#FFEDA0';
    }
    legend.addTo(myMap);
}
)


