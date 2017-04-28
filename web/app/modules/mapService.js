'use strict';
angular.module('Smity')
    .service('MapService', ['UradService', MapService]);


function MapService(UradService) {

    return {
        initMap: initMap
    };

    function initGoogleMaps(mapconfig) {
        var coord = new google.maps.LatLng(mapconfig.centerlat, mapconfig.centerlng);
        var options = {
            zoom: mapconfig.centerzoom,
            center: coord
        };
        var map = new google.maps.Map(document.getElementById(mapconfig.containername), options);
        console.log(map);
        return map;
    }

    function initHeatmap(map, mapconfig) {
        var heatmap = new HeatmapOverlay(map,
            {
                "minOpacity": mapconfig.minopacity,
                "maxOpacity": mapconfig.maxopacity,
                "backgroundColor": "rgba(" + mapconfig.bgred + "," + mapconfig.bggreen + "," + mapconfig.bgblue + "," + mapconfig.bgalpha + ")",
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

    function computeDist(point1, point2) {
        return Math.sqrt(Math.pow(point1["lat"] - point2["lat"], 2) + Math.pow(point1["long"] - point2["long"], 2));
    }

    function heatmapPlotData(heatmap, mapconfig, fromtime, totime) {
        UradService.heatMap(fromtime, totime)
            .then(function (data) {
                var avglat, avglong, avgval, count;
                var data_normalized = [];

                for (var i = 0; i < data.length; i++) {
                    if (data[i].hasOwnProperty('visited'))
                        continue;

                    avglat = data[i]["lat"];
                    avglong = data[i]["long"];
                    avgval = data[i]["temperature"];
                    count = 1;

                    for (var j = i + 1; j < data.length; j++) {
                        if (computeDist(data[i], data[j]) < mapconfig.radius) {
                            avglat += data[j]["lat"];
                            avglong += data[j]["long"];
                            avgval += data[j]["temperature"];
                            count++;
                            data[j]['visited'] = true;
                        }
                    }

                    var point = {};
                    point["lat"] = avglat / count;
                    point["long"] = avglong / count;
                    point["temperature"] = avgval / count;

                    data[i]['visited'] = true;
                    data_normalized.push(point);
                }

                if (mapconfig.extremarelative === true) {
                    var minval = Number.MAX_VALUE;
                    var maxval = Number.MIN_VALUE;
                    data_normalized.forEach(function (item) {
                        if (item["temperature"] < minval)
                            minval = item["temperature"];
                        if (item["temperature"] > maxval)
                            maxval = item["temperature"];
                    });
                }
                else {
                    minval = mapconfig.minval;
                    maxval = mapconfig.maxval;
                }
                var testData = {
                    min: minval,
                    max: maxval,
                    data: data_normalized
                };
                heatmap.setData(testData);
            });
    }

    function initMap() {

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


    }

}