'use strict';

angular.module('Smity')
	.config(['momentPickerProvider', function (momentPickerProvider) {
		momentPickerProvider.options({
			/* Picker properties */
			locale:        'ro',
			format:        'L LTS',
			minView:       'decade',
			maxView:       'minute',
			startView:     'year',
			autoclose:     true,
			today:         false,
			keyboard:      false,

			/* Extra: Views properties */
			leftArrow:     '&larr;',
			rightArrow:    '&rarr;',
			yearsFormat:   'YYYY',
			monthsFormat:  'MMM',
			daysFormat:    'D',
			hoursFormat:   'HH',
			minutesFormat: 'mm',
			secondsFormat: 'ss',
			minutesStep:   1,
			secondsStep:   1
		});
	}])
	.directive('chartAndMap', [ChartAndMap]);

function ChartAndMap() {
	return {
		template: '<div id="maps-div" style="width: 80vw; height: 40vh; margin-right: 5vw; margin-left: 1vw;" ></div>' +
		// '<div id="chart-container" style="width: 100vw; height: 60vh;">' +
		'<div id="chart-div" class="chart-init"></div>' +
		'<div id="calendar-div" style="width: 20%; height: 100%; float:right;">' +
		'<input class="form-control" ng-model="vm.startDate" placeholder="Start date" moment-picker="vm.startDate">' +
		'<input class="form-control" ng-model="vm.endDate" placeholder="End date" moment-picker="vm.endDate">' +
		'<button id="apply-date" ng-click="apply()">Apply</button></div>',
		scope: {
			jsonPath: '@'
		},
		restrict: 'E',
		link: link
	};

	function link($scope, $el, $attrs) {
		var viewportHeight = document.getElementById('chart-div').clientHeight;
		var viewportWidth = document.getElementById('chart-div').clientWidth;
		var margin = {top: 0.1 * viewportHeight, right: 0.01 * viewportWidth, bottom: 40, left: 0.05 * viewportWidth};
		var height = (0.9 * viewportHeight) - margin.top - margin.bottom;
		var width = viewportWidth - margin.left - margin.right;
		var xScale = d3.scaleTime().range([0, width - 0.2 * viewportWidth]);
		var yScale = d3.scaleLinear().range([height, 0]);
		var color = d3.scaleOrdinal(d3.schemeCategory10);
		var svg, bisectDate, line, focus, first;

		var markerCount = 0;
		var markers = [];
		var slice = 0;
		var map;

		function initMap() {
			var uluru = {lat: 46.075538, lng: 23.568816};
			map = new google.maps.Map(document.getElementById('maps-div'), {
				zoom: 12,
				center: uluru
			});
			var marker = new google.maps.Marker({
				position: uluru,
				map: map
			});
			markers.push(marker);
		}

		function addMarkerToMap(options) {
			var keys = Object.keys(options);
			markers.forEach(function (marker) {
				marker.setMap(null);
			});
			markers = [];
			keys.forEach(function (key) {
				var infowindow = new google.maps.InfoWindow();
				var myLatLng = new google.maps.LatLng(options[key].lat, options[key].long);
				var marker = new google.maps.Marker({
					position: myLatLng,
					map: map,
					icon: {
						path: google.maps.SymbolPath.CIRCLE,
						scale: 8.5,
						fillColor: options[key].color,
						fillOpacity: 1,
						strokeWeight: 1
					}
				});
				markers.push(marker);
				google.maps.event.addListener(marker, 'click', (function(marker, markerCount) {
					return function() {
						infowindow.setContent(key + '<br>' + options[key].param);
						infowindow.open(map, marker);
					}
				})(marker, markerCount));
			});
		}

		function initD3() {
			svg = d3.select(document.getElementById('chart-div')).append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			bisectDate = d3.bisector(function (d) {
				return d.time;
			}).left;

			// set the line attributes
			line = d3.line()
				.curve(d3.curveBasis)
				.x(function (d) {
					return xScale(d.date);
				})
				.y(function (d) {
					return yScale(d.temperature);
				});

			focus = svg.append("g").style("display", "none");
			first = 0;
		}

		function reScale(cache, keys) {
			var temperatures = keys.map(function (name) {
				return {
					name: name,
					values: cache[name].map(function (d) {
						return {date: d.time, temperature: d.temperature};
					})
				};
			});


			// add domain ranges to the x and y scales
			xScale.domain([
				d3.min(temperatures, function (c) {
					return d3.min(c.values, function (v) {
						return v.date;
					});
				}),
				d3.max(temperatures, function (c) {
					return d3.max(c.values, function (v) {
						return v.date;
					});
				})
			]);

			yScale.domain([
				d3.min(temperatures, function (c) {
					return d3.min(c.values, function (v) {
						return v.temperature;
					});
				}),
				d3.max(temperatures, function (c) {
					return d3.max(c.values, function (v) {
						return v.temperature;
					});
				})
			]);

			if (first) {
				d3.select("g.y.axis")
					.call(d3.axisLeft(yScale));
				d3.select("g.x.axis")
					.call(d3.axisBottom(xScale));
				d3.selectAll("path.line").remove();
				var path = svg.selectAll(".stockXYZ")
					.data(temperatures);
				path.append("path")
					.attr("class", "line")
					.attr("id", function (d, i) {
						return "id" + d.name;
					})
					.attr("d", function (d) {
						return line(d.values);
					})
					.style("stroke", function (d) {
						return color(d.name);
					});
			} else {
				first = 1;
			}

			return temperatures;
		}

		function measure(measures, keys) {
			var result = d3.selectAll(".legend-results")
				.data(measures);
			result.selectAll('text').remove();
			result.selectAll('text')
				.data(measures)
				.enter()
				.append("text")
				.attr("x", width - 25)
				.attr("y", function (d, i) {
					return i * 1.5 * slice + 0.026 * viewportHeight;
				})
				.text(function (d) {
					return d.value;
				})
				.on("mouseover", function (d, i) {
					var key = d.name;
					keys.forEach(function (dt) {
						if (key != dt) {
							d3.select("#id" + dt).style("opacity", 0.1);
						} else {
							d3.select("#id" + dt).style('stroke-width', 3);
						}
					});
				})
				.on("mouseout", function (d, i) {
					keys.forEach(function (dt) {
						d3.select("#id" + dt).style("opacity", 1);
						d3.select("#id" + dt).style('stroke-width', 1);
					});
				});
		}

		// import data and create chart
		function generateD3(startDate, endDate) {
			d3.json($scope.jsonPath + startDate + "/" + endDate,
				function (data) {
					var keys = Object.keys(data);
					var length = keys.length;
					var measures = [];

					for (i = 0; i < keys.length; i++) {
						var aux = {
							key: keys[i],
							value: 0,
							time: 0
						};
						measures.push(aux);
						for (var j = 0; j < data[keys[i]].length; j++) {
							data[keys[i]][j].time = data[keys[i]][j].time * 1000;
						}
					}

					var lookup = {};
					for (var i = 0; i < measures.length; i++) {
						lookup[measures[i]['key']] = i;
					}

					var cache = JSON.parse(JSON.stringify(data));
					color.domain(keys);
					// color domain
					// create stocks array with object for each company containing all data
					var temperatures = reScale(cache, keys);
					// add the x axis
					svg.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + height + ")")
						.style("font", "1em times")
						.call(d3.axisBottom(xScale));

					// add the y axis
					svg.append("g")
						.attr("class", "y axis")
						.call(d3.axisLeft(yScale))
						.append("text")
						.attr("transform", "rotate(-90)")
						.attr("y", -60)
						.attr("x", -viewportHeight * 0.25)
						.attr("font-size", "1.5em")
						.attr("dy", ".71em")
						.style("text-anchor", "middle")
						.attr("fill", '#000000')
						.text("Temperature (Celsius)");

					// add circle at intersection
					focus.append("circle")
						.attr("class", "y")
						.attr("fill", "none")
						.attr("stroke", "black")
						.style("opacity", 0.5)
						.attr("r", 8);

					// add horizontal line at intersection
					focus.append("line")
						.attr("class", "x")
						.attr("stroke", "black")
						.attr("stroke-dasharray", "3,3")
						.style("opacity", 0.5)
						.attr("x1", 0)
						.attr("x2", width);

					// add vertical line at intersection
					focus.append("line")
						.attr("class", "y")
						.attr("stroke", "black")
						.attr("stroke-dasharray", "3,3")
						.style("opacity", 0.5)
						.attr("y1", 0)
						.attr("y2", height);

					// append rectangle for capturing if mouse moves within area
					svg.append("rect")
						.attr("width", 0.8 * width)
						.attr("height", height)
						.style("fill", "none")
						.style("pointer-events", "all")
						.on("mouseover", function () {
							focus.style("display", null);
						})
						.on("mouseout", function () {
							focus.style("display", "none");
						})
						.on("mousemove", mousemove)
						.on("click", showmap);

					// add the line groups
					var stock = svg.selectAll(".stockXYZ")
						.data(temperatures)
						.enter().append("g")
						.attr("class", "stockXYZ");

					// add the stock price paths
					stock.append("path")
						.attr("class", "line")
						.attr("id", function (d, i) {
							return "id" + d.name;
						})
						.attr("d", function (d) {
							return line(d.values);
						})
						.style("stroke", function (d) {
							return color(d.name);
						});


					stock.append("text")
						.datum(function (d) {
							var maxLen = d.values.length;
							return {name: d.name, value: d.values[maxLen - 1]};
						})
						.attr("transform", function (d) {
							return "translate(" + xScale(d.value.date) + "," + yScale(d.value.temperature) + ")";
						})
						.attr("id", function (d, i) {
							return "text_id" + i;
						})
						.attr("x", 3)
						.attr("dy", ".35em");

					var legend = svg.append("g")
						.attr("class", "legend")
						.attr("x", width - 0.25 * viewportWidth)
						.attr("y", height - 0.25 * viewportHeight)
						.attr("height", viewportHeight)
						.attr("width", 0.1 * viewportWidth)
						.attr('transform', 'translate(-' + 0.13 * viewportWidth + ',0)');

					slice = (height - 0.25 * viewportHeight) / length;

					legend.selectAll('rect')
						.data(temperatures)
						.enter()
						.append("rect")
						.attr("id", function (d, i) {
							return "rect_id" + d.name;
						})
						.attr("x", width - 65)
						.attr("y", function (d, i) {
							return i * 1.5 * slice;
						})
						.attr("width", slice)
						.attr("height", slice)
						.style("fill", function (d) {
							return color(d.name);
						})
						.style("stroke-width", 2)
						.style("stroke", function (d) {
							return color(d.name);
						})
						.on("mouseover", function (d, i) {
							var key = d.name;
							keys.forEach(function (dt) {
								if (key != dt) {
									d3.select("#id" + dt).style("opacity", 0.1);
								} else {
									d3.select("#id" + dt).style('stroke-width', 3);
								}
							});
						})
						.on("mouseout", function (d, i) {
							keys.forEach(function (dt) {
								d3.select("#id" + dt).style("opacity", 1);
								d3.select("#id" + dt).style('stroke-width', 1);
							});
						})
						.on('click', function (d, i) {
							var key = d.name;
							if (keys.indexOf(key) != -1) {
								d3.select("#id" + d.name).style("display", "none");
								d3.select("#rect_id" + d.name).style("fill", "white");
								for (var j = 0; j < cache[key].length; j++) {
									delete cache[key][j];
								}
								delete cache[key];
								for (var k = 0; k < measures.length; k++) {
									if (measures[k]['key'] == key) {
										measures[k]['value'] = 0;
										break;
									}
								}
								var index = keys.indexOf(key);
								keys.splice(index, 1);
								reScale(cache, keys);
							} else {
								d3.select("#id" + d.name).style("display", "");
								d3.select("#rect_id" + d.name).style("fill", color(key));
								cache[key] = [];
								keys.push(key);
								for (j = 0; j < data[key].length; j++) {
									cache[key].push(data[key][j]);
								}
								reScale(cache, keys);
							}
						});

					legend.selectAll('text')
						.data(temperatures)
						.enter()
						.append("text")
						.attr("x", width - 30)
						.attr("y", function (d, i) {
							return i * 1.5 * slice + 0.026 * viewportHeight;
						})
						.attr("height", slice)
						.text(function (d) {
							return d.name;
						})
						.on("mouseover", function (d, i) {
							var key = d.name;
							keys.forEach(function (dt) {
								if (key != dt) {
									d3.select("#id" + dt).style("opacity", 0.1);
								} else {
									d3.select("#id" + dt).style('stroke-width', 3);
								}
							});
						})
						.on("mouseout", function (d, i) {
							keys.forEach(function (dt) {
								d3.select("#id" + dt).style("opacity", 1);
								d3.select("#id" + dt).style('stroke-width', 1);
							});
						});


					var results = svg.append("g")
						.attr("class", "legend-results")
						.attr("x", width - 0.25 * viewportWidth)
						.attr("y", height - 0.25 * viewportHeight)
						.attr("height", viewportHeight)
						.attr("width", 100)
						.attr('transform', 'translate(-' + 0.07 * viewportWidth + ',0)');

					results.selectAll('text')
						.data(measures)
						.enter()
						.append("text")
						.attr("x", width - 5)
						.attr("y", function (d, i) {
							return i * 1.5 * slice + 0.026 * viewportHeight;
						})
						.text(function (d) {
							return d.value;
						})
						.on("mouseover", function (d, i) {
							var key = d.name;
							keys.forEach(function (dt) {
								if (key != dt) {
									d3.select("#id" + dt).style("opacity", 0.1);
								} else {
									d3.select("#id" + dt).style('stroke-width', 3);
								}
							});
						})
						.on("mouseout", function (d, i) {
							keys.forEach(function (dt) {
								d3.select("#id" + dt).style("opacity", 1);
								d3.select("#id" + dt).style('stroke-width', 1);
							});
						});
					// mousemove function
					function mousemove() {
						var x0 = xScale.invert(d3.mouse(this)[0]);
						var maxVal = -100;
						var maxI = 0;
						var key = null;
						keys.forEach(function (keyVal) {
							var j = bisectDate(cache[keyVal], x0, 1);
							if (cache[keyVal][j] != null) {
								measures[lookup[keyVal]]['value'] = cache[keyVal][j].temperature;
								if (cache[keyVal][j].temperature > maxVal) {
									maxVal = cache[keyVal][j].temperature;
									maxI = j;
									key = keyVal;
								}
							}
						});

						if (key != null) {
							measure(measures, keys);
							var d0 = cache[key][maxI], d1 = cache[key][maxI - 1];
							var d = x0 - d0.time > d1.time - x0 ? d1 : d0;

							focus.select("circle.y")
								.attr("transform", "translate(" + xScale(d.time) + "," + yScale(d.temperature) + ")");

							focus.select("line.y")
								.attr("y2", height - yScale(d.temperature))
								.attr("transform", "translate(" + xScale(d.time) + ","
									+ yScale(d.temperature) + ")");

							focus.select("line.x")
								.attr("x2", xScale(d.time))
								.attr("transform", "translate(0,"
									+ (yScale(d.temperature)) + ")");
						}
					}

					function showmap() {
						var x0 = xScale.invert(d3.mouse(this)[0]);
						var options = {};
						keys.forEach(function (key) {
							var j = bisectDate(cache[key], x0, 1);
							var d0 = cache[key][j], d1 = cache[key][j - 1];
							if (d0 && d1) {
								var d = x0 - d0.time > d1.time - x0 ? d1 : d0;
								aux = {
									lat: d.lat,
									long: d.long,
									color: color(key),
									param: d.temperature
								};
								options[key] = aux;
							}
						});

						addMarkerToMap(options);
					}

				});
		}

		$scope.apply = function () {
			var startDate = new Date($scope.vm.startDate);
			var endDate = new Date($scope.vm.endDate);
			var unixStart = Math.floor(startDate.getTime()/1000);
			var unixEnd = Math.floor(endDate.getTime()/1000);
			document.getElementById('chart-div').innerHTML = "";
			initD3();
			generateD3(unixStart, unixEnd);
		};

		var now = new Date();
		var initStart = Math.floor(now.getTime() / 1000 - 10000);
		var initEnd = Math.floor(now.getTime() / 1000);

		initMap();
		initD3();
		generateD3(initStart, initEnd);
	}
}