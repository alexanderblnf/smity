exports.filterByCity = function(data, out, city) {
    data.forEach(function (d) {
        if (d.city == city) {
            out.push(d);
        }
    });
};

exports.filterOnline = function (data, out) {
    var date = new Date();
    var epochTime = date.getTime() / 1000;
    data.forEach(function (d) {
        if (epochTime - d.timelast < 62) {
            out.push(d);
        }
    });
};

exports.filterDeviceAverages = function (device, data) {
    var out = null;
    data.forEach(function (d) {
        if (d.id == device) {
            out = {
                temperature: d.avg_temperature,
                pressure: d.avg_pressure,
                humidity: d.avg_humidity,
                voc: d.avg_voc,
                min_voc: d.min_voc,
                max_voc: d.max_voc,
                co2: d.avg_co2,
                ch2o: d.avg_ch2o,
                pm25: d.avg_pm25,
                cpm: d.avg_cpm
            };
        }
    });

    return out;
};

exports.filterAverages = function(data) {
    var out = [];
    data.forEach(function (d) {
        var temp = {
            id: d.id,
            temperature: d.avg_temperature,
            pressure: d.avg_pressure,
            humidity: d.avg_humidity,
            voc: d.avg_voc,
            min_voc: d.min_voc,
            max_voc: d.max_voc,
            co2: d.avg_co2,
            ch2o: d.avg_ch2o,
            pm25: d.avg_pm25,
            cpm: d.avg_cpm
        };
        out.push(temp);
    });

    return out;
};

exports.filter = function(data, out, param, limit) {
    var tmp = 0;
    data.forEach(function (d, index) {
        var temp = [];
        if (index == 0) {
            tmp = d[param];
            temp.push(Number(d.time));
            temp.push(Number(d[param]));
            out.push(temp);
        } else {
            if (Math.abs(d[param] - tmp) > limit) {
                tmp = d[param];
                temp.push(Number(d.time));
                temp.push(Number(d[param]));
                out.push(temp);
            }
        }
    });
};
