// basic SVG setup
var margin = {top: 20, right: 100, bottom: 40, left: 100};
var height = 600 - margin.top - margin.bottom;
var width = 1060 - margin.left - margin.right;

var xScale = d3.scaleTime().range([0, width - 100]);
var yScale = d3.scaleLinear().range([height, 0]);
var color = d3.scaleOrdinal(d3.schemeCategory10);

// setup the axes
//    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

var svg = d3.select("#chart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// create function to parse dates into date objects
//    var parseDate = d3.time.format("%Y-%m-%d").parse;
//    var formatDate = d3.time.format("%Y-%m-%d");
var bisectDate = d3.bisector(function (d) {
	return d.time;
}).left;

// set the line attributes
var line = d3.line()
	.curve(d3.curveBasis)
	.x(function (d) {
		return xScale(d.date);
	})
	.y(function (d) {
		return yScale(d.temperature);
	});

var focus = svg.append("g").style("display", "none");

// import data and create chart
d3.json("http://localhost:8080/elastic/all/temperature/1491725689/1491825689",
	function (data) {
		var keys = Object.keys(data);
		for (var i = 0; i < keys.length; i++) {
			for (var j = 0; j < data[keys[i]].length; j++) {
				data[keys[i]][j].time = data[keys[i]][j].time * 1000;
			}
		}
		var cacheKeys = keys;
		var cache = data;

		// color domain
		color.domain(keys);

		// create stocks array with object for each company containing all data
		var temperatures = color.domain().map(function (name) {
			return {
				name: name,
				values: data[name].map(function (d) {
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
			0,
			// d3.min(stocks, function(c) { return d3.min(c.values, function(v) { return v.close; }); }),
			d3.max(temperatures, function (c) {
				return d3.max(c.values, function (v) {
					return v.temperature;
				});
			})
		]);

		// add the x axis
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(xScale));

		// add the y axis
		svg.append("g")
			.attr("class", "y axis")
			.call(d3.axisLeft(yScale))
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -60)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
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
			.attr("width", width)
			.attr("height", height)
			.style("fill", "none")
			.style("pointer-events", "all")
			.on("mouseover", function () {
				focus.style("display", null);
			})
			.on("mouseout", function () {
				focus.style("display", "none");
			})
			.on("mousemove", mousemove);

		// add the line groups
		var stock = svg.selectAll(".stockXYZ")
			.data(temperatures)
			.enter().append("g")
			.attr("class", "stockXYZ");

		// add the stock price paths
		stock.append("path")
			.attr("class", "line")
			.attr("id", function (d, i) {
				return "id" + i;
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
			.attr("x", width - 65)
			.attr("y", height - 200)
			.attr("height", 15 * keys.length)
			.attr("width", 200)
			.attr('transform', 'translate(-20,100)');

		legend.selectAll('rect')
			.data(temperatures)
			.enter()
			.append("rect")
			.attr("x", width - 65)
			.attr("y", function (d, i) {
				return i * 20;
			})
			.attr("width", 15)
			.attr("height", 15)
			.style("fill", function (d) {
				return color(d.name)
			})
			.on("mouseover", function (d, i) {
				for (j = 0; j < keys.length; j++) {
					if (i !== j) {
						d3.select("#id" + j).style("opacity", 0.1);
						d3.select("#text_id" + j).style("opacity", 0.2);
					} else {
						d3.select("#id" + j).style('stroke-width', 3);
					}
				}
			})
			.on("mouseout", function (d, i) {
				for (j = 0; j < keys.length; j++) {
					d3.select("#id" + j).style("opacity", 1);
					d3.select("#text_id" + j).style("opacity", 1);
					d3.select("#id" + j).style('stroke-width', 1);
				}
			})
			.on('click', function (d, i) {
				d3.select("#id" + i).style("display", "none");
				for (var j = 0; j < data[keys[i]].length; j++) {
					delete data[keys[i]][j];
				}
				keys.splice(i, 1);

			});

		legend.selectAll('text')
			.data(temperatures)
			.enter()
			.append("text")
			.attr("x", width - 45)
			.attr("y", function (d, i) {
				return i * 20 + 11;
			})
			.text(function (d) {
				return d.name;
			})
			.on("mouseover", function (d, i) {
				for (j = 0; j < keys.length; j++) {
					if (i !== j) {
						d3.select("#id" + j).style("opacity", 0.1);
						d3.select("#text_id" + j).style("opacity", 0.2);
					} else {
						d3.select("#id" + j).style('stroke-width', 3);
					}
				}
			})
			.on("mouseout", function (d, i) {
				for (j = 0; j < keys.length; j++) {
					d3.select("#id" + j).style("opacity", 1);
					d3.select("#text_id" + j).style("opacity", 1);
					d3.select("#id" + j).style('stroke-width', 1);
				}
			});

		// mousemove function
		function mousemove() {
			var x0 = xScale.invert(d3.mouse(this)[0]);
			var maxVal = -100;
			var maxI = 0;
			var key = null;
			for (var i = 0; i < keys.length; i++) {
				var j = bisectDate(data[keys[i]], x0, 1); // gives index of element which has date higher than x0
				if (data[keys[i]][j] != null) {
					if (data[keys[i]][j].temperature > maxVal) {
						maxVal = data[keys[i]][j].temperature;
						maxI = j;
						key = keys[i];
					}
				}

			}

			if (key != null) {
				var d0 = data[key][maxI], d1 = data[key][maxI - 1];
				var d = x0 - d0.time > d1.time - x0 ? d1 : d0;

//                var close = d3.max(d);

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
	});