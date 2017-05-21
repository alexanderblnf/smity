'use strict';

angular.module('beacon')
    .service('BeaconService', ['BeaconResource', BeaconService]);

function BeaconService(BeaconResource) {

    var genderpie, agepie, ospie;
    var totalHits, people;

    return {
        campaigns: campaigns,
        showProfile: showProfile,
        getTotalHits: getTotalHits,
        getPeople: getPeople,
        showInsights: showInsights,
        generateChart: generateChart
    };

    function campaigns() {
        return BeaconResource.campaigns().$promise;
    }

    function insights(campaign, startTime, endTime) {
        var newCampaign = campaign.split('/');
        return BeaconResource.insights({campaign: newCampaign[2], startTime: startTime, endTime: endTime}).$promise;
    }

    function profile(campaign) {
        var newCampaign = campaign.split('/');
        return BeaconResource.profile({campaign: newCampaign[2]}).$promise;
    }

    function showProfile(campaignName, callback) {

        profile(campaignName)
            .then(function (profiles) {

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
                    {label: "< 18", value: u18},
                    {label: "18-24", value: u25},
                    {label: "25-34", value: u35},
                    {label: "35-44", value: u45},
                    {label: "45-54", value: u55},
                    {label: "55-64", value: u65},
                    {label: "> 65", value: o65}
                ];

                agepie.updateProp("data.content", agecontent);
                people = fem + mal + sna;
                callback(people);
            });
    }

    function showInsights(campaignName, startDate, endDate, callback) {

        insights(campaignName, startDate, endDate)
            .then(function (insights) {
                var android = 0;
                var ios = 0;

                insights.forEach(function (value) {
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

                totalHits = android + ios;
                callback(totalHits);
            });
    }

    function getTotalHits() {
        return totalHits;
    }

    function getPeople() {
        return people;
    }

    function generateChart() {

        var viewportHeight = document.getElementById('pie-container').clientHeight;
        var viewportWidth = document.getElementById('pie-container').clientWidth;

        var style = {
            color: '#ffffff',
            fontSize: '1.5em'
        };

        genderpie = new d3pie("genderpie", {
            header: {
                title: {
                    text: "Gender"
                },
                location: "pie-center"
            },
            size: {
                canvasHeight: viewportHeight,
                canvasWidth: viewportWidth / 3.25,
                pieInnerRadius: "45%",
                pieOuterRadius: "60%"
            },
            data: {
                sortOrder: "label-asc",
                content: [
                    {label: "Male", value: 1},
                    {label: "Female", value: 1}
                ]
            },
            misc: {
                colors: {
                    background: null, // transparent
                    segments: [
                        "#b9c7a4", //kaki

                        "#3b978a", //turcoaz
                        "#1e5454", //turcoaz inchis
                        "#d6dcc2", //verde deschis
                        "#f9ebd0",  //roz

                        "#023536", //negru
                        "#f8f5e6" //alb
                    ],
                    segmentStroke: "none"
                },
                gradient: {
                    enabled: true,
                    percentage: 90,
                    color: "#000000"
                }
            },
            labels: {
                mainLabel: {
                    color: "#ffffff",
                    font: "arial",
                    fontSize: 16
                },
                percentage: {
                    color: "#ffffff",
                    font: "arial",
                    fontSize: 16,
                    decimalPlaces: 0
                }
            }
        });

        agepie = new d3pie("agepie", {
            header: {
                title: {
                    text: "Age"
                },
                location: "pie-center"
            },
            size: {
                canvasHeight: viewportHeight,
                canvasWidth: viewportWidth / 3.25,
                pieInnerRadius: "45%",
                pieOuterRadius: "60%"
            },
            data: {
                sortOrder: "label-asc",
                content: [
                    {label: "< 18", value: 1},
                    {label: "18-24", value: 1},
                    {label: "25-34", value: 1},
                    {label: "35-44", value: 1},
                    {label: "45-54", value: 1},
                    {label: "55-64", value: 1},
                    {label: "> 65", value: 1}
                ]
            },
            misc: {
                colors: {
                    background: null, // transparent
                    segments: [
                        "#f9ebd0", "#d6dcc2", "#b9c7a4", "#3b978a",
                        "#1e5454", "#023536", "#f8f5e6"
                    ],
                    segmentStroke: "none"
                },
                gradient: {
                    enabled: true,
                    percentage: 90,
                    color: "#000000"
                }
            },
            labels: {
                mainLabel: {
                    color: "#ffffff",
                    font: "arial",
                    fontSize: 16
                },
                percentage: {
                    color: "#ffffff",
                    font: "arial",
                    fontSize: 16,
                    decimalPlaces: 0
                }
            }
        });

        ospie = new d3pie("ospie", {
            header: {
                title: {
                    text: "Devices"
                },
                location: "pie-center"
            },
            size: {
                canvasHeight: viewportHeight,
                canvasWidth: viewportWidth / 3.25,
                pieInnerRadius: "45%",
                pieOuterRadius: "60%"
            },
            data: {
                sortOrder: "label-asc",
                content: [
                    {label: "Android", value: 1},
                    {label: "iOS", value: 1}
                ]
            },
            misc: {
                colors: {
                    background: null, // transparent
                    segments: [
                        "#f8f5e6", //alb
                        "#d6dcc2", //verde deschis
                        "#f9ebd0",  //roz
                        "#3b978a", //turcoaz
                        "#1e5454", //turcoaz inchis

                        "#b9c7a4", //kaki

                        "#023536" //negru

                    ],
                    segmentStroke: "none"
                },
                gradient: {
                    enabled: true,
                    percentage: 90,
                    color: "#000000"
                }
            },
            labels: {
                mainLabel: {
                    color: "#ffffff",
                    font: "arial",
                    fontSize: 16
                },
                percentage: {
                    color: "#ffffff",
                    font: "arial",
                    fontSize: 16,
                    decimalPlaces: 0
                }
            }
        });
    }
}