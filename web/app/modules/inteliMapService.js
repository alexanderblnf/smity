'use strict';
angular.module('Smity')
    .service('InteliMapService', ['IntelilightService', InteliMapService]);

function InteliMapService(IntelilightService) {

    return {
        initMap: initMap
    };

    function _initGoogleMaps(mapconfig) {
        var coord = new google.maps.LatLng(mapconfig.centerlat, mapconfig.centerlng);
        var options = {
            zoom: mapconfig.centerzoom,
            center: coord
        };
        var map = new google.maps.Map(document.getElementById(mapconfig.containername), options);
        return map;
    }

    function makeInfoBubble(controller, map, marker, position) {

        var infoBubble = new InfoBubble({
            arrowStyle: 2
        });

        /*
         -------Voltage------
         */
        var voltage = document.createElement('div');
        var span = document.createElement('span');
        span.innerHTML = "Voltage: " + controller["nvoVolt"];
        voltage.appendChild(span);
        var br = document.createElement('br');
        voltage.appendChild(br);
        span = document.createElement('span');
        span.innerHTML = "Average voltage: " + controller["nvoVoltAvg"];
        voltage.appendChild(span);
        br = document.createElement('br');
        voltage.appendChild(br);
        span = document.createElement('span');
        span.innerHTML = "Maximum voltage: " + controller["nvoVoltMax"];
        voltage.appendChild(span);
        br = document.createElement('br');
        voltage.appendChild(br);
        span = document.createElement('span');
        span.innerHTML = "Minimum voltage: " + controller["nvoVoltMin"];
        voltage.appendChild(span);
        br = document.createElement('br');
        voltage.appendChild(br);

        /*
         -------General info---------
         */
        var info = document.createElement('div');
        br = document.createElement('br');
        span = document.createElement('span');
        span.innerHTML = "Controller: " + controller["controller"];
        info.appendChild(span);
        info.appendChild(br);
        span = document.createElement('span');
        span.innerHTML = "Time: " + controller["time"];
        info.appendChild(span);
        br = document.createElement('br');
        info.appendChild(br);
        span = document.createElement('span');
        span.innerHTML = "Config number: " + controller["nvoCfgNo"];
        info.appendChild(span);
        br = document.createElement('br');
        info.appendChild(br);
        span = document.createElement('span');
        span.innerHTML = "Time: " + controller["time"];
        span = document.createElement('span');
        span.innerHTML = "Status: " + controller["nvoLampStatus"]["lampStatus"];
        info.appendChild(span);
        br = document.createElement('br');
        info.appendChild(br);
        span = document.createElement('span');
        span.innerHTML = "Level: " + controller["nvoLampStatus"]["lampLevel"];
        info.appendChild(span);
        br = document.createElement('br');
        info.appendChild(br);
        span = document.createElement('span');
        span.innerHTML = "Position: " + controller["gps"]["lat"] + " " + controller["gps"]["lon"];
        info.appendChild(span);
        br = document.createElement('br');
        info.appendChild(br);
        span = document.createElement('span');
        span.innerHTML = "Hours on: " + controller["nvoOnHours"];
        info.appendChild(span);
        br = document.createElement('br');
        info.appendChild(br);
        span = document.createElement('span');
        span.innerHTML = "Number of cycles: " + controller["nvoCycles"];
        info.appendChild(span);
        br = document.createElement('br');
        info.appendChild(br);

        /*
         ------Current------
         */
        var current = document.createElement('div');
        br = document.createElement('br');
        span = document.createElement('span');
        span.innerHTML = "Current: " + controller["nvoCurrent"];
        current.appendChild(span);
        current.appendChild(br);
        span = document.createElement('span');
        span.innerHTML = "Current average: " + controller["nvoCurrentAvg"];
        current.appendChild(span);
        br = document.createElement('br');
        current.appendChild(br);

        var power = document.createElement('div');
        br = document.createElement('br');
        span = document.createElement('span');
        span.innerHTML = "Reactive Power: " + controller["nvoPowerReact"];
        power.appendChild(span);
        power.appendChild(br);
        span = document.createElement('span');
        span.innerHTML = "Active Power: " + controller["nvoPowerAct"];
        power.appendChild(span);
        br = document.createElement('br');
        power.appendChild(br);
        span = document.createElement('span');
        span.innerHTML = "Average Reactive Power: " + controller["nvoPowerReactAvg"];
        power.appendChild(span);
        br = document.createElement('br');
        power.appendChild(br);
        span = document.createElement('span');
        span.innerHTML = "Average Active Power: " + controller["nvoPowerActAvg"];
        power.appendChild(span);
        br = document.createElement('br');
        power.appendChild(br);



        infoBubble.addTab('Info', info);
        infoBubble.addTab('Voltage', voltage);
        infoBubble.addTab('Current', current);
        infoBubble.addTab('Power', power);
        infoBubble.open(map, marker);
    }

    function addMarkerToMap(controllers, map) {
        var markerCount = 0;
        controllers.forEach(function (controller) {
            var infowindow = new google.maps.InfoWindow();
            var myLatLng = new google.maps.LatLng(controller["gps"]["lat"], controller["gps"]["lon"]);
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8.5,
                    fillColor: '#ff6600',
                    fillOpacity: 1,
                    strokeWeight: 1
                }
            });
            google.maps.event.addListener(marker, 'click', (function (marker, markerCount) {
                return function () {
                    // infowindow.setContent('Controller: ' + controller["controller"]);
                    // makeInfoWindow(controller, infowindow);
                    // infowindow.open(map, marker);
                    makeInfoBubble(controller, map, marker, myLatLng);
                    // showInfo(controller);
                }
            })(marker, markerCount));
        });
    }

    function initMap() {

        var CITY_LAT = 46.060625;
        var CITY_LNG = 23.573919;

        var mapconfig = {};
        //coordinates of map center
        mapconfig.centerlat = CITY_LAT;
        mapconfig.centerlng = CITY_LNG;
        //zoom level on google maps
        mapconfig.centerzoom = 15;
        //name of div where google maps is drawn
        mapconfig.containername = 'inteli-map-container';
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

        var map = _initGoogleMaps(mapconfig);
        IntelilightService.getLatest()
            .then(function (controllers) {
                addMarkerToMap(controllers, map)
            });


    }

}