'use strict';
angular.module('Smity')
    .service('InteliMapService', ['IntelilightService', InteliMapService]);

var campaigndata = [];

var genderpie = new d3pie("genderpie", {
    header: {
        title: {
            text: "Gender"
        },
        location: "pie-center"
    },
    size: {
        pieInnerRadius: "60%"
    },
    data: {
        sortOrder: "label-asc",
        content: [
            {label: "Male", value: 1},
            {label: "Female", value: 1}
        ]
    }
});

var agepie = new d3pie("agepie", {
    header: {
        title: {
            text: "Age"
        },
        location: "pie-center"
    },
    size: {
        pieInnerRadius: "60%"
    },
    data: {
        sortOrder: "label-asc",
        content: [
            {label: "Under 18", value: 1},
            {label: "Aged 18-24", value: 1},
            {label: "Aged 25-34", value: 1},
            {label: "Aged 35-44", value: 1},
            {label: "Aged 45-54", value: 1},
            {label: "Aged 55-64", value: 1},
            {label: "Over 65", value: 1}
        ]
    }
});

var ospie = new d3pie("ospie", {
    header: {
        title: {
            text: "Devices"
        },
        location: "pie-center"
    },
    size: {
        pieInnerRadius: "60%"
    },
    data: {
        sortOrder: "label-asc",
        content: [
            {label: "Android", value: 1},
            {label: "iOS", value: 1}
        ]
    }
});

var campaigns;

$(document).ready(function () {
    $.get("http://localhost:8080/beacons/campaigns", function (data) {
        campaigns = JSON.parse(data);
        var ccid = 0;
        $.each(campaigns, function (index, value) {
            var name = value.name.replace("static/voucher/", "").slice(0, 8);
            for (var i = name.length - 1; i >= 0; i--) {
                if (name[i] == '-')
                    name = name.slice(0, i);
            }

            $("#campaigns").append($('<option>', {value: index, text: name}));

            /*
             var nrhits;
             $.get( "http://localhost:8080/beacons/profile/"+campaigns[index].name, function( pdata ) {
             var profiles = JSON.parse(pdata);
             var fem, mal, sna;

             if (profiles!=null && profiles.hasOwnProperty("sex")){
             fem = profiles.sex.hasOwnProperty('F')?profiles.sex.F:0;
             mal = profiles.sex.hasOwnProperty('M')?profiles.sex.M:0;
             sna = profiles.sex.hasOwnProperty('NA')?profiles.sex.NA:0;
             }
             else{
             fem = 0;
             mal = 0;
             sna = 0;
             }

             var sum = fem+mal+sna;
             campaigndata.push({created: value.created, hits: sum});

             ccid++;
             if (ccid==campaigns.length){

             }
             });*/
        });
    });
});

$("#showcampaign").click(function () {
    var camp = $("#campaigns option:selected").val();
    if (camp == -1)
        return;

    $.get("http://localhost:8080/beacons/profile/" + campaigns[camp].name, function (data) {
        var profiles = JSON.parse(data);

        var u18, u25, u35, u45, u55, u65, o65, ana, fem, mal, sna;

        if (profiles != null && profiles.hasOwnProperty("age")) {
            u18 = profiles.age.hasOwnProperty('U18') ? profiles.age.U18 : 0;
            u25 = profiles.age.hasOwnProperty('U25') ? profiles.age.U25 : 0;
            u35 = profiles.age.hasOwnProperty('U35') ? profiles.age.U35 : 0;
            u45 = profiles.age.hasOwnProperty('U45') ? profiles.age.U45 : 0;
            u55 = profiles.age.hasOwnProperty('U55') ? profiles.age.U55 : 0;
            u65 = profiles.age.hasOwnProperty('U65') ? profiles.age.U65 : 0;
            o65 = profiles.age.hasOwnProperty('O65') ? profiles.age.O65 : 0;
            ana = profiles.age.hasOwnProperty('NA') ? profiles.age.NA : 0;
        }
        else {
            u18 = 0;
            u25 = 0;
            u35 = 0;
            u45 = 0;
            u55 = 0;
            u65 = 0;
            o65 = 0;
            ana = 0;
        }

        if (profiles != null && profiles.hasOwnProperty("sex")) {
            fem = profiles.sex.hasOwnProperty('F') ? profiles.sex.F : 0;
            mal = profiles.sex.hasOwnProperty('M') ? profiles.sex.M : 0;
            sna = profiles.sex.hasOwnProperty('NA') ? profiles.sex.NA : 0;
        }
        else {
            fem = 0;
            mal = 0;
            sna = 0;
        }

        var gendercontent = [
            {label: "Male", value: fem},
            {label: "Female", value: mal}
        ];
        genderpie.updateProp("data.content", gendercontent);

        var agecontent = [
            {label: "Under 18", value: u18},
            {label: "Aged 18-24", value: u25},
            {label: "Aged 25-34", value: u35},
            {label: "Aged 35-44", value: u45},
            {label: "Aged 45-54", value: u55},
            {label: "Aged 55-64", value: u65},
            {label: "Over 65", value: o65}
        ];

        agepie.updateProp("data.content", agecontent);

        $("#people").text(fem + mal + sna);
    });

    var startdate = new Date(campaigns[camp].data.startDate).valueOf() / 1000;
    var enddate = new Date(campaigns[camp].data.endDate).valueOf() / 1000;

    //console.log("http://localhost:8080/beacons/insights/"+campaigns[camp].name+"/"+startdate+"/"+enddate);
    $.get("http://localhost:8080/beacons/insights/" + campaigns[camp].name + "/" + startdate + "/" + enddate,
        function (data) {
            var insights = JSON.parse(data);
            var android = 0;
            var ios = 0;

            $.each(insights, function (index, value) {
                if (value.type == "androidview")
                    android += value.total;
                else if (value.type == "iosview")
                    ios += value.total;
            });

            var oscontent = [
                {label: "Android", value: android},
                {label: "iOS", value: ios}
            ];
            ospie.updateProp("data.content", oscontent);

            $("#hits").text(android + ios);
        });

    $("#created").text(new Date(campaigns[camp].created).toISOString().slice(0, 10));
    $("#enddate").text(new Date(campaigns[camp].data.endDate).toISOString().slice(0, 10));
});
</
script >