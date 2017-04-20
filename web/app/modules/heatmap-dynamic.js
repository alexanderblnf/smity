
function googleMapsLoaded(){

}

function initGoogleMaps(mapconfig){
    var coord = new google.maps.LatLng(mapconfig.centerlat, mapconfig.centerlng);
    var options = {
        zoom: mapconfig.centerzoom,
        center: coord
    };
    map = new google.maps.Map(document.getElementById(mapconfig.containername), options);
    return map;
}

function initHeatmap(map, mapconfig){

    var heatmap = new HeatmapOverlay(map,
        {
            "minOpacity": mapconfig.minopacity,
            "maxOpacity": mapconfig.maxopacity,
            "backgroundColor" : "rgba("+mapconfig.bgred+","+mapconfig.bggreen+","+mapconfig.bgblue+","+mapconfig.bgalpha+")",
            "radius": mapconfig.radius,
            "scaleRadius": true,
            "useLocalExtrema": false,
            latField: mapconfig.latfield,
            lngField: mapconfig.lngfield,
            valueField: mapconfig.valfield
        }
    );

    return heatmap;
}

function heatmapPlotData(heatmap, mapconfig, fromtime, totime){
    $.get({ url: "http://localhost:8080/elastic/heatmapdata/temperature/"+fromtime+"/"+totime,
            success: function( data ) {
                //var cells = {};
                if (mapconfig.extremarelative === true) {
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
                else{
                    minval = mapconfig.minval;
                    maxval = mapconfig.maxval;
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

    var mapconfig = {};
    //coordinates of map center
    mapconfig.centerlat = CITY_LAT;
    mapconfig.centerlng = CITY_LNG;
    //zoom level on google maps
    mapconfig.centerzoom = 15;
    //name of div where google maps is drawn
    mapconfig.containername = 'map-container';
    //opacity of heatmap extremas
    mapconfig.minopacity = 0.1;
    mapconfig.maxopacity = 0.8;
    //heatmap background color
    mapconfig.bgred = 255;
    mapconfig.bggreen = 0;
    mapconfig.bgblue = 0;
    mapconfig.bgalpha = 0.0;
    //coord radius of heatmap point
    mapconfig.radius = 0.0008;
    //name of fields in data
    mapconfig.valfield = 'temperature';
    mapconfig.latfield = 'lat';
    mapconfig.lngfield = 'long';
    //use extremas from data as min/max for heatmap
    mapconfig.extremarelative = true;
    //if extremarelative=false
    //use the following values as heatmap scale min/max
    mapconfig.minval = null;
    mapconfig.maxval = null;


    var map = initGoogleMaps(mapconfig);
    var heatmap = initHeatmap(map, mapconfig);

    var fromtime = 1480687145;
    var totime = 1492551145;

    heatmapPlotData(heatmap, mapconfig, fromtime, totime);

}, 3000);