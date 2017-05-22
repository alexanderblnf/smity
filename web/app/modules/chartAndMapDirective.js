'use strict';

angular.module('Smity')
    .config(['momentPickerProvider', function (momentPickerProvider) {
        momentPickerProvider.options({
            /* Picker properties */
            locale: 'ro',
            format: 'L LT',
            minView: 'decade',
            maxView: 'minute',
            startView: 'year',
            autoclose: true,
            today: false,
            keyboard: false,

            /* Extra: Views properties */
            leftArrow: '&larr;',
            rightArrow: '&rarr;',
            yearsFormat: 'YYYY',
            monthsFormat: 'MMM',
            daysFormat: 'D',
            hoursFormat: 'HH',
            minutesFormat: 'mm',
            minutesStep: 1
        });
    }])
    .directive('chartAndMap', [ChartAndMap]);

function ChartAndMap() {
    return {
        // template: '<div id="chart-container" style="width: 80vw; height: 40vh;">' +
        templateUrl: '/templates/chartAndMapTemplate.html',
        scope: {
            param: '@',
            yAxis: '@',
            predictCallback: '&',
            weeklyCallback: '&',
            mapType: '=',
            heatMapFunction: '&',
            units: '='
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
        // var color = d3.scaleOrdinal(d3.schemeCategory10);
        var color = d3.scaleOrdinal()
            .range(['#2ba1f9', '#fc9765', '#64b5a9', '#ffed26', '#8bff8f', '#ca73ff', '#66ccff', '#f4e97d', '#ee5859', '#c2e351', '#ecc781', '#8a96dd', '#e3d4ff', '#ff8c89', '#638463', '#e5000c', '#e55107']);
        var svg, bisectDate, line, focus, first, limitLines;
        var max = 0;
        var maxWidth = 0;
        var limits = {
            'co2_colors': ['green', 'yellow', 'orange', 'red'],
            'co2': [600, 1000, 2500, 5000],
            'co2_messages': ['acceptable', 'limit', 'drowsiness', 'adverse health effects'],
            'pm25_colors': ['yellow'],
            'pm25': [35],
            'pm25_messages': ['limit']
        };

        var markerCount = 0;
        var markers = [];
        var slice = 0;
        var map, result;

        var mapStyle = [
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
        ];

        function initMap() {
            var uluru = {lat: 46.075538, lng: 23.568816};
            map = new google.maps.Map(document.getElementById('maps-div'), {
                zoom: 12,
                center: uluru,
                styles: mapStyle
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
                google.maps.event.addListener(marker, 'click', (function (marker, markerCount) {
                    return function () {
                        infowindow.setContent(key + '<br>' + options[key].param + ' ' + $scope.units[$scope.param]);
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
                .curve(d3.curveCatmullRom)
                .x(function (d) {
                    return xScale(d.date);
                })
                .y(function (d) {
                    return yScale(d.param);
                });

            focus = svg.append("g").style("display", "none");
            first = 0;
        }

        function reScale(cache, keys, param) {
            max = 0;
            maxWidth = 0;
            var params = keys.map(function (name) {
                return {
                    name: name,
                    values: cache[name].map(function (d) {
                        return {date: d.time, param: d[param]};
                    })
                };
            });


            // add domain ranges to the x and y scales
            xScale.domain([
                d3.min(params, function (c) {
                    return d3.min(c.values, function (v) {
                        return v.date;
                    });
                }),
                d3.max(params, function (c) {
                    return d3.max(c.values, function (v) {
                        if (v.date > maxWidth) {
                            maxWidth = v.date;
                        }
                        return v.date;
                    });
                })
            ]);

            yScale.domain([
                d3.min(params, function (c) {
                    return d3.min(c.values, function (v) {
                        return v.param;
                    });
                }),
                d3.max(params, function (c) {
                    return d3.max(c.values, function (v) {
                        if (v.param > max) {
                            max = v.param;
                        }
                        return v.param;
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
                    .data(params);
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

                d3.selectAll(".danger-line").remove();
                d3.selectAll(".danger-text").remove();
                drawLimits(param);
            } else {
                first = 1;
            }

            return params;
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
                    return i * 1.5 * slice + slice / 5 + 0.06 * viewportHeight;
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

        function drawLimits(param) {

            if (limits[param] != null) {
                var values = limits[param];
                var messages = limits[param + "_messages"];
                limitLines = svg.append("g");
                for (var i = 0; i < values.length; i++) {
                    if (max >= values[i]) {
                        limitLines.append("line")
                            .attr("class", "danger-line")
                            .attr("stroke", limits[param + '_colors'][i])
                            .attr("stroke-dasharray", "2,3")
                            .attr("stroke-width", "2")
                            .style("opacity", 1)
                            .attr("x1", 0)
                            .attr("x2", xScale(maxWidth))
                            .attr("transform", "translate(0," + yScale(values[i]) + ")");
                        limitLines.append("text")
                            .attr("class", "danger-text")
                            .attr("x", 0)
                            .attr("transform", "translate(0," + yScale(values[i] + 5) + ")")
                            .style("fill", limits[param + '_colors'][i])
                            .style("text-shadow", "1px 1px #000000")
                            .text(messages[i]);

                    }
                }
            }
        }

        // import data and create chart
        function generateD3(startDate, endDate, param) {
            d3.json("http://localhost:8080/elastic/all/" + param + "/" + startDate + "/" + endDate,
                function (data) {
                    document.getElementById('d3-loader').style.display = 'none';
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
                    var params = reScale(cache, keys, param);
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
                        .attr("fill", '#ffffff')
                        .text($scope.yAxis + " (" + $scope.units[$scope.param] + ")");

                    // add circle at intersection
                    focus.append("circle")
                        .attr("class", "y")
                        .attr("fill", "none")
                        .attr("stroke", "white")
                        .style("opacity", 0.5)
                        .attr("r", 8);

                    // add horizontal line at intersection
                    focus.append("line")
                        .attr("class", "x")
                        .attr("stroke", "white")
                        .attr("stroke-dasharray", "3,3")
                        .style("opacity", 0.5)
                        .attr("x1", 0)
                        .attr("x2", width);

                    // add vertical line at intersection
                    focus.append("line")
                        .attr("class", "y")
                        .attr("stroke", "white")
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
                        .data(params)
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
                            return "translate(" + xScale(d.value.date) + "," + yScale(d.value.param) + ")";
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

                    slice = (height - 0.3 * viewportHeight) / length;

                    legend.selectAll('circle')
                        .data(params)
                        .enter()
                        .append("circle")
                        .attr("id", function (d, i) {
                            return "circ_id" + d.name;
                        })
                        .attr("cx", width - 65)
                        .attr("cy", function (d, i) {
                            return i * 1.5 * slice + 0.06 * viewportHeight;
                        })
                        .attr("r", slice / 2)
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
                                d3.select("#circ_id" + d.name).style("fill", "white");
                                for (j = 0; j < cache[key].length; j++) {
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
                                reScale(cache, keys, param);
                            } else {
                                d3.select("#id" + d.name).style("display", "");
                                d3.select("#circ_id" + d.name).style("fill", color(key));
                                cache[key] = [];
                                keys.push(key);
                                for (var j = 0; j < data[key].length; j++) {
                                    cache[key].push(data[key][j]);
                                }
                                reScale(cache, keys, param);
                            }
                        });

                    legend.selectAll('text')
                        .data(params)
                        .enter()
                        .append("text")
                        .attr("x", width - 30)
                        .attr("y", function (d, i) {
                            return i * 1.5 * slice + slice / 5 + 0.06 * viewportHeight;
                        })
                        .attr("height", 3 / 4 * slice)
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


                    legend.append('text')
                        .text("Senzori")
                        .attr("x", width - 0.025 * viewportWidth)
                        .attr("y", 0)
                        .attr("height", 0.06 * viewportHeight)
                        .style("font-size", "1.5em");
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
                            return i * 1.5 * slice + slice / 5 + 0.06 * viewportHeight;
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

                    drawLimits(param);
                    // mousemove function
                    function mousemove() {
                        var x0 = xScale.invert(d3.mouse(this)[0]);
                        var maxVal = -100;
                        var maxI = 0;
                        var key = null;
                        keys.forEach(function (keyVal) {
                            var j = bisectDate(cache[keyVal], x0, 1);
                            if (cache[keyVal][j] != null) {
                                var d0 = cache[keyVal][j], d1 = cache[keyVal][j - 1];
                                var d = x0 - d0.time > d1.time - x0 ? d1 : d0;
                                measures[lookup[keyVal]]['value'] = d[param];
                                if (cache[keyVal][j][param] > maxVal) {
                                    maxVal = cache[keyVal][j][param];
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
                                .attr("transform", "translate(" + xScale(d.time) + "," + yScale(d[param]) + ")");

                            focus.select("line.y")
                                .attr("y2", height - yScale(d[param]))
                                .attr("transform", "translate(" + xScale(d.time) + ","
                                    + yScale(d[param]) + ")");

                            focus.select("line.x")
                                .attr("x2", xScale(d.time))
                                .attr("transform", "translate(0,"
                                    + (yScale(d[param])) + ")");
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
                                    param: d[param]
                                };
                                options[key] = aux;
                            }
                        });

                        addMarkerToMap(options);
                    }

                });
        }

        function makeModal(param) {
            var modal = new tingle.modal({
                footer: true,
                stickyFooter: false,
                closeMethods: ['overlay', 'button', 'escape'],
                closeLabel: "Close",
                cssClass: ['--visible', 'tingle-modal--overflow'],
                onOpen: function () {
                    console.log('modal open');
                },
                onClose: function () {
                    console.log('modal closed');
                },
                beforeClose: function () {
                    // here's goes some logic
                    // e.g. save content before closing the modal
                    return true; // close the modal
                    return false; // nothing happens
                }
            });

            modal.setContent('<div id="weekly-container">' +
                '<h1>Raport saptamanal - ' + $scope.yAxis + '</h1>' +
                '<table id="weekly-table">' +
                '</table>' +
                '<div id="loading-container"><div class="loader" id="weekly-loader">Loading...</div></div>' +
                '<h3>Valori maxime</h3>' +
                '<div id="weekly-map"></div>' +
                '</div>');
            //
            // modal.addFooterBtn('Button label', 'tingle-btn tingle-btn--primary', function () {
            //     // here goes some logic
            //     modal.close();
            // });
            //
            modal.addFooterBtn('Close', 'tingle-btn tingle-btn--danger', function () {
                // here goes some logic
                modal.close();
            });
            //
            modal.open();

            // modal.close();
        }

        function fillTd(weekday, index, response, param) {
            var td, div, h3, br, span;
            td = document.createElement('td');
            div = document.createElement('div');
            h3 = document.createElement('h3');
            h3.innerHTML = weekday;
            div.appendChild(h3);
            br = document.createElement('br');
            div.appendChild(br);
            span = document.createElement('span');
            span.className = "bold-span";
            span.innerHTML = "Valoare maxima: ";
            div.appendChild(span);
            span = document.createElement('span');
            span.innerHTML = response[index]['max'][param] + " " + $scope.units[$scope.param];
            div.appendChild(span);
            br = document.createElement('br');
            div.appendChild(br);
            span = document.createElement('span');
            span.className = "bold-span";
            span.innerHTML = "Valoare medie: ";
            div.appendChild(span);
            span = document.createElement('span');
            span.innerHTML = response[index]['means'] + " " + $scope.units[$scope.param];
            div.appendChild(span);
            td.appendChild(div);

            return td;
        }

        function _initGoogleMaps(mapconfig) {
            var coord = new google.maps.LatLng(mapconfig.centerlat, mapconfig.centerlng);
            var options = {
                zoom: mapconfig.centerzoom,
                center: coord,
                styles: mapStyle
            };
            var map = new google.maps.Map(document.getElementById(mapconfig.containername), options);
            return map;
        }

        function addMaxToMap(sensors, map, param) {
            var weekdays = ['Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata', 'Duminica'];
            sensors.forEach(function (sensor, index) {
                var infoWindow = new google.maps.InfoWindow();
                var myLatLng = new google.maps.LatLng(sensor["max"]["lat"], sensor["max"]["long"]);
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
                google.maps.event.addListener(marker, 'mouseover', (function (marker) {
                    return function () {
                        infoWindow.setContent(weekdays[index] + "<br>" + sensor["max"][param] + "");
                        infoWindow.open(map, marker);
                    }
                })(marker));
                google.maps.event.addListener(marker, 'mouseout', (function (marker) {
                    return function () {
                        infoWindow.close();
                    }
                })(marker));
            });
        }


        function initMax(sensors, param) {

            var CITY_LAT = 46.060625;
            var CITY_LNG = 23.573919;

            var mapconfig = {};
            //coordinates of map center
            mapconfig.centerlat = CITY_LAT;
            mapconfig.centerlng = CITY_LNG;
            //zoom level on google maps
            mapconfig.centerzoom = 10;
            //name of div where google maps is drawn
            mapconfig.containername = 'weekly-map';
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
            addMaxToMap(sensors, map, param);
        }

        function fillModal(param, response) {
            var table = document.getElementById('weekly-table');
            var weekdays = ['Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata', 'Duminica'];
            var tr, td;
            for (var i = 0; i < 7; i++) {
                if (i == 6) {
                    tr = document.createElement('tr');
                    td = fillTd(weekdays[i], i, response, param);
                    tr.appendChild(td);
                    table.appendChild(tr);
                } else {
                    if (i % 2 == 0) {
                        tr = document.createElement('tr');
                        td = fillTd(weekdays[i], i, response, param);
                        tr.appendChild(td);
                    } else {
                        td = fillTd(weekdays[i], i, response, param);
                        tr.appendChild(td);
                        table.appendChild(tr);
                    }
                }
            }
            document.getElementById('loading-container').innerHTML = "";
            initMax(response, param);
            var modal = document.getElementsByClassName('tingle-modal');
            modal[0].className = 'tingle-modal --visible tingle-modal--visible tingle-modal--overflow';
        }

        $scope.apply = function () {
            var startDate = new Date($scope.vm.startDate);
            var endDate = new Date($scope.vm.endDate);
            var unixStart = Math.floor(startDate.getTime() / 1000);
            var unixEnd = Math.floor(endDate.getTime() / 1000);
            document.getElementById('chart-div').innerHTML = '<div class="loader" id="d3-loader">Loading...</div>';
            initD3($scope.param);
            generateD3(unixStart, unixEnd, $scope.param);
        };

        $scope.applyHeatMap = function () {
            var startDate = new Date($scope.vm.startDateHeatMap);
            var endDate = new Date($scope.vm.endDateHeatMap);
            var unixStart = Math.floor(startDate.getTime() / 1000);
            var unixEnd = Math.floor(endDate.getTime() / 1000);

            $scope.heatMapFunction()(unixStart, unixEnd);
        };

        var now = new Date();
        var initStart = Math.floor(now.getTime() / 1000 - 10000);
        var initEnd = Math.floor(now.getTime() / 1000);

        $scope.predict = function () {
            var futureTime = initEnd + 24 * 3600;
            $scope.predictCallback()($scope.param, futureTime, function (response) {
                $scope.result = Math.floor(response.result) + " " + $scope.units[$scope.param];
            });
        };

        $scope.weekly = function () {
            makeModal($scope.param);
            $scope.weeklyCallback()($scope.param, function (response) {
                fillModal($scope.param, response);
            });
        };


        initMap();
        initD3($scope.param);
        generateD3(initStart, initEnd, $scope.param);
    }
}