
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

function heatmapPlotData(heatmap, fromtime, totime, space, relative, minval, maxval, centerlat, centerlng){
    $.get({ url: "http://localhost:8080/elastic/heatmapdata/temperature/"+fromtime+"/"+totime,
            success: function( data ) {
                //var cells = {};
                if (relative === true) {
                    minval = Number.MAX_VALUE;
                    maxval = Number.MIN_VALUE;
                    $.each(data, function (index, item) {
                        if (item["temperature"] < minval)
                            minval = item["temperature"];
                        if (item["temperature"] > maxval)
                            maxval = item["temperature"];

                        /*
                        var latindex = (item["lat"] - centerlat)/space;
                        var lngindex = (item["long"] - centerlng)/space;
                        if (!cells.hasOwnProperty(latindex)){
                            cells[latindex] = {};
                        }
                        if (!cells[latindex].hasOwnProperty(lngindex)) {
                            cells[latindex][lngindex] = [];
                        }
                        cells[latindex][lngindex].push = index;*/
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

    var map = initGoogleMaps(CITY_LAT, CITY_LNG, 15, 'map-container');
    var heatmap = initHeatmap(map, 0.1, 0.8, 255, 0, 0, 0.0, 0.0008, 'temperature');

    var fromtime = 1480687145;
    var totime = 1492551145;

    heatmapPlotData(heatmap, fromtime, totime, 0.0008, true, null, null, CITY_LAT, CITY_LNG);

}, 3000);