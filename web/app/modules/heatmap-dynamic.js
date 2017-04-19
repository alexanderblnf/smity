
var heatmap;
var map;

function googleMapsLoaded(){

}

function initGoogleMaps(lat, lng, zoomlvl, containerid){
    var coord = new google.maps.LatLng(lat, lng);
    var options = {
        zoom: zoomlvl,
        center: coord
    };
    map = new google.maps.Map(document.getElementById(containerid), options);
    return map;
}

setTimeout(function(){

    var CITY_LAT = 46.0684893;
    var CITY_LNG = 23.5634674;

    initGoogleMaps(CITY_LAT, CITY_LNG, 15, "map-container");

    // heatmap layer
    heatmap = new HeatmapOverlay(map,
        {
            // "minOpacity": 0,
            "minOpacity": 0.5,
            "backgroundColor" : "rgba(255,0,0, 0.1)",
            "radius": 0.0008,
            "maxOpacity": 0.8,
            "scaleRadius": true,
            "useLocalExtrema": false,
            latField: 'lat',
            lngField: 'long',
            valueField: 'temperature'
        }
    );

    /*
    var testData = {
        max: 10,
        // min: -10,
        data: [{lat: CITY_LAT, lng:CITY_LNG, count: 5}, {lat: CITY_LAT+0.005, lng:CITY_LNG, count: 8}, {lat: CITY_LAT, lng:CITY_LNG+0.005, count: 3}]
    };*/

    var fromtime = 1480687145;
    var totime = 1492551145;
    $.get({  url: "http://localhost:8080/elastic/82000039/temperature/"+fromtime+"/"+totime,
        success: function( data ) {
            console.log(data);
            var testData = {
                min: 15,
                max: 20,
                data: data
            };
            heatmap.setData(testData);
        },
        dataType: "json" });

   // heatmap = heatmap.setData(testData);


}, 3000);