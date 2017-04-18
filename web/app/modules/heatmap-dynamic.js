
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