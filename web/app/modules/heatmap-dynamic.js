
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

function initHeatmap(map, minopacity, maxopacity, bgred, bggreen, bgblue, bgalpha, radius, valfield){
    var heatmap = new HeatmapOverlay(map,
        {
            "minOpacity": minopacity,
            "maxOpacity": maxopacity,
            "backgroundColor" : "rgba("+bgred+","+bggreen+","+bgblue+","+bgalpha+")",
            "radius": radius,
            "scaleRadius": true,
            "useLocalExtrema": false,
            latField: 'lat',
            lngField: 'long',
            valueField: valfield
        }
    );

    return heatmap;
}

function heatmapPlotData(heatmap, fromtime, totime, size, relative, minval, maxval){
    $.get({ url: "http://localhost:8080/elastic/82000039/temperature/"+fromtime+"/"+totime,
            success: function( data ) {
                if (relative === true) {
                    minval = Number.MAX_VALUE;
                    maxval = Number.MIN_VALUE;
                    $.each(data, function (index, item) {
                        if (item["temperature"] < minval)
                            minval = item["temperature"];
                        if (item["temperature"] > maxval)
                            maxval = item["temperature"];
                    });
                }
                var testData = {
                    min: minval,
                    max: maxval,
                    data: data
                };
                heatmap.setData(testData);
            },
            dataType: "json"
    });
}

setTimeout(function(){

    var CITY_LAT = 46.0684893;
    var CITY_LNG = 23.5634674;

    var map = initGoogleMaps(CITY_LAT, CITY_LNG, 15, "map-container");
    var heatmap = initHeatmap(map, 0.1, 0.8, 255, 0, 0, 0.1, 0.0008, 'temperature');

    var fromtime = 1480687145;
    var totime = 1492551145;

    heatmapPlotData(heatmap, fromtime, totime, 50, false, 15, 20);

}, 3000);