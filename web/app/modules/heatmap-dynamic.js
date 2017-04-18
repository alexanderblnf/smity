
var heatmap;

function initGoogleMaps(){

}

setTimeout(function(){
    /*
    console.log('success!');

     heatmap = h337.create({
        container: document.getElementById('map-container')
    });

    heatmap.setData({
        max: 5,
        data: [{ x: 10, y: 15, value: 5}]
    });
*/
    var CITY_LAT = 46.0684893;
    var CITY_LNG = 23.5634674;

    map = new google.maps.Map(document.getElementById('map-container'), {
        center: {lat: CITY_LAT, lng: CITY_LNG},
        zoom: 8
    });

    /*
    heatmap = h337.create({
        container: document.getElementById('map-container')
    });

    heatmap.setData({
        max: 5,
        data: [{ x: 10, y: 15, value: 5}]
    });*/

    // don't forget to add gmaps-heatmap.js
    var myLatlng = new google.maps.LatLng(CITY_LAT, CITY_LNG);
    // map options,
    var myOptions = {
        zoom: 15,
        center: myLatlng
    };
    // standard map
    map = new google.maps.Map(document.getElementById("map-container"), myOptions);
    // heatmap layer
    heatmap = new HeatmapOverlay(map,
        {
            "backgroundColor" : "#ff0000",
            // radius should be small ONLY if scaleRadius is true (or small radius is intended)
            "radius": 0.0008,
            "maxOpacity": 1,
            // scales the radius based on map zoom
            "scaleRadius": true,
            // if set to false the heatmap uses the global maximum for colorization
            // if activated: uses the data maximum within the current map boundaries
            //   (there will always be a red spot with useLocalExtremas true)
            "useLocalExtrema": false,
            // which field name in your data represents the latitude - default "lat"
            latField: 'lat',
            // which field name in your data represents the longitude - default "lng"
            lngField: 'lng',
            // which field name in your data represents the data value - default "value"
            valueField: 'count'
        }
    );

    var testData = {
        max: 8,
        data: [{lat: CITY_LAT, lng:CITY_LNG, count: 3}, {lat: CITY_LAT, lng:CITY_LNG, count: 3}, {lat: CITY_LAT, lng:CITY_LNG, count: 3}]
    };

    heatmap.setData(testData);

}, 3000);