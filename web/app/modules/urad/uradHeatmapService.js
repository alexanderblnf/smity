'use strict';

angular
	.module('urad')
	.service('UradHeatmapService', ['ElasticService', UradHeatmapService]);

function UradHeatmapService(ElasticService) {

	return {
		initMap: initMap,
		reloadMap: reloadMap
	};

	function _initGoogleMaps(mapconfig) {
		var coord = new google.maps.LatLng(mapconfig.centerlat, mapconfig.centerlng);
		var options = {
			zoom: mapconfig.centerzoom,
			center: coord,
			styles: [
				{
					"featureType": "administrative",
					"elementType": "all",
					"stylers": [
						{
							"saturation": "-100"
						}
					]
				},
				{
					"featureType": "administrative.province",
					"elementType": "all",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "landscape",
					"elementType": "all",
					"stylers": [
						{
							"saturation": -100
						},
						{
							"lightness": 65
						},
						{
							"visibility": "on"
						}
					]
				},
				{
					"featureType": "poi",
					"elementType": "all",
					"stylers": [
						{
							"saturation": -100
						},
						{
							"lightness": "50"
						},
						{
							"visibility": "simplified"
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "all",
					"stylers": [
						{
							"saturation": "-100"
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "all",
					"stylers": [
						{
							"visibility": "simplified"
						}
					]
				},
				{
					"featureType": "road.arterial",
					"elementType": "all",
					"stylers": [
						{
							"lightness": "30"
						}
					]
				},
				{
					"featureType": "road.local",
					"elementType": "all",
					"stylers": [
						{
							"lightness": "40"
						}
					]
				},
				{
					"featureType": "transit",
					"elementType": "all",
					"stylers": [
						{
							"saturation": -100
						},
						{
							"visibility": "simplified"
						}
					]
				},
				{
					"featureType": "water",
					"elementType": "geometry",
					"stylers": [
						{
							"hue": "#ffff00"
						},
						{
							"lightness": -25
						},
						{
							"saturation": -97
						}
					]
				},
				{
					"featureType": "water",
					"elementType": "labels",
					"stylers": [
						{
							"lightness": -25
						},
						{
							"saturation": -100
						}
					]
				}
			]
		};

		return new google.maps.Map(document.getElementById(mapconfig.containername), options);
	}

	function _initHeatmap(map, mapconfig) {
		return new HeatmapOverlay(map,
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
	}

	function _computeDist(point1, point2) {
		return Math.sqrt(Math.pow(point1["lat"] - point2["lat"], 2) + Math.pow(point1["long"] - point2["long"], 2));
	}

	function _plotData(heatmap, mapconfig, param, fromtime, totime) {
		ElasticService.heatMap(param, fromtime, totime)
			.then(function (data) {
				var avglat, avglong, avgval, count;
				var data_normalized = [];

				for (var i = 0; i < data.length; i++) {
					if (data[i].hasOwnProperty('visited'))
						continue;

					avglat = data[i]["lat"];
					avglong = data[i]["long"];
					avgval = data[i][param];
					count = 1;

					for (var j = i + 1; j < data.length; j++) {
						if (_computeDist(data[i], data[j]) < mapconfig.radius) {
							avglat += data[j]["lat"];
							avglong += data[j]["long"];
							avgval += data[j][param];
							count++;
							data[j]['visited'] = true;
						}
					}

					var point = {};
					point["lat"] = avglat / count;
					point["long"] = avglong / count;
					point[param] = avgval / count;

					data[i]['visited'] = true;
					data_normalized.push(point);
				}

				if (mapconfig.extremarelative === true) {
					var minval = Number.MAX_VALUE;
					var maxval = Number.MIN_VALUE;
					data_normalized.forEach(function (item) {
						if (item[param] < minval)
							minval = item[param];
						if (item[param] > maxval)
							maxval = item[param];
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

	function initMap(param, fromTime, toTime) {
		var CITY_LAT = 46.0684893;
		var CITY_LNG = 23.5634674;

		var mapconfig = {
			//coordinates of map center
			centerlat: CITY_LAT,
			centerlng: CITY_LNG,
			//zoom level on google maps
			centerzoom: 15,
			//name of div where google maps is drawn
			containername: 'map-container',
			//opacity of heatmap extremas
			minopacity: 0.1,
			maxopacity: 0.8,
			//heatmap background color
			bgred: 255,
			bggreen: 0,
			bgblue: 0,
			bgalpha: 0.0,
			//coord radius of heatmap point
			radius: 0.0008,
			//name of fields in data
			valfield: param,
			latfield: 'lat',
			lngfield: 'long',
			//use extremas from data as min/max for heatmap
			extremarelative: true,
			//if extremarelativ:false
			//use the following values as heatmap scale min/max
			minval: null,
			maxval: null
		};

		var map = _initGoogleMaps(mapconfig);
		var heatmap = _initHeatmap(map, mapconfig);

		_plotData(heatmap, mapconfig, param, fromTime, toTime);

		return {
			heatmap: heatmap,
			mapconfig: mapconfig
		};
	}

	function reloadMap(mapObject, param, fromTime, toTime) {
		_plotData(mapObject.heatmap, mapObject.mapconfig, param, fromTime, toTime);
	}

}