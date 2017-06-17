'use strict';

angular.module('intelilight')
	.service('IntelilightService', ['IntelilightResource', IntelilightService]);

function IntelilightService(IntelilightResource) {
	return {
		initMap: initMap
	};

	function _initGoogleMaps() {
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

		var coord = new google.maps.LatLng(mapconfig.centerlat, mapconfig.centerlng);
		var options = {
			zoom: mapconfig.centerzoom,
			center: coord
		};

		return new google.maps.Map(document.getElementById(mapconfig.containername), options);
	}

	function _makeInfoBubble(controller, map, marker) {
		var voltage = '<div></div><br><span class="bold-span">Voltage: </span><span>' + controller["nvoVolt"] + '</span><br>' +
			'<span class="bold-span">Average voltage: </span><span>' + controller["nvoVoltAvg"] + '</span><br>' +
			'<span class="bold-span">Maximum voltage: </span><span>' + controller["nvoVoltMax"] + '</span><br>' +
			'<span class="bold-span">Minimum voltage: </span><span>' + controller["nvoVoltMin"] + '</span><br></div>';

		var date = new Date(controller["time"] * 1000);
		var dateString = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();

		var info = '<div></div><br><span class="bold-span">Controller: </span><span>' + controller["controller"] + '</span><br>' +
			'<span class="bold-span">Time: </span><span>' + dateString + '</span><br>' +
			'<span class="bold-span">Config number: </span><span>' + controller["nvoCfgNo"] + '</span><br>' +
			'<span class="bold-span">Status: </span><span>' + controller["nvoLampStatus"]["lampStatus"] + '</span><br>' +
			'<span class="bold-span">Level: </span><span>' + controller["nvoLampStatus"]["lampLevel"] + '</span><br>' +
			'<span class="bold-span">Position: </span><span>' + controller["gps"]["lat"] + ", " + controller["gps"]["lon"] + '</span><br>' +
			'<span class="bold-span">Hours on: </span><span>' + controller["nvoOnHours"] + '</span><br>' +
			'<span class="bold-span">Nr of cycles: </span><span>' + controller["nvoCycles"] + '</span><br></div>';

		var current = '<div><br><span class="bold-span">Current: </span><span>' + controller["nvoCurrent"] + '</span><br>' +
			'<span class="bold-span">Current average: </span><span>' + controller["nvoCurrentAvg"] + '</span><br>' +
			'</div>';

		var power = '<div></div><br><span class="bold-span">Reactive power: </span><span>' + controller["nvoPowerReact"] + '</span><br>' +
			'<span class="bold-span">Active power: </span><span>' + controller["nvoPowerAct"] + '</span><br>' +
			'<span class="bold-span">Average Reactive Power: </span><span>' + controller["nvoPowerReactAvg"] + '</span><br>' +
			'<span class="bold-span">Average Active Power: </span><span>' + controller["nvoPowerActAvg"] + '</span><br></div>';

		var infoBubble = new InfoBubble({
			arrowStyle: 2
		});

		infoBubble.addTab('Info', info);
		infoBubble.addTab('Voltage', voltage);
		infoBubble.addTab('Current', current);
		infoBubble.addTab('Power', power);
		infoBubble.open(map, marker);
	}

	function _addMarkerToMap(controllers, map) {
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
					_makeInfoBubble(controller, map, marker, myLatLng);
				}
			})(marker, markerCount));
		});
	}

	function initMap() {
		var map = _initGoogleMaps();

		IntelilightResource.latest().$promise
			.then(function (controllers) {
				_addMarkerToMap(controllers, map)
			});
	}
}