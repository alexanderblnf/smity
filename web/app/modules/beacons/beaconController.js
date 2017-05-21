'use strict';

angular.module('beacon')
    .controller('BeaconController', ['BeaconService', BeaconController]);

function BeaconController(BeaconService) {
    var vm = this;

    vm.campaigns = [];
    vm.people = undefined;
    vm.selected = 0;
    vm.endDate = undefined;
    vm.created = undefined;
    vm.totalHits = undefined;
    vm.displayCampaign = displayCampaign;

    _init();
    function _init() {

        BeaconService.campaigns()
            .then(function (response) {

                vm.campaigns = response;
                vm.campaigns.map(function (campaign) {
                    // static/voucher/Piata-T-iw5255zf.ftl

                    campaign.displayName = campaign.name.replace("static/voucher/", "").slice(0, 8);
                    for (var i = campaign.displayName.length - 1; i >= 0; i--) {
                        if (campaign.displayName[i] == '-')
                            campaign.displayName = campaign.displayName.slice(0, i);
                    }

                    return campaign;
                });

            });
    }

    function displayCampaign() {
        BeaconService.generateChart();
        var startDate;
        var endDate;

        if (vm.campaigns[vm.selected].data) {
            startDate = new Date(vm.campaigns[vm.selected].data.startDate).valueOf() / 1000;
            endDate = new Date(vm.campaigns[vm.selected].data.endDate).valueOf() / 1000;
        }

        BeaconService.showProfile(vm.campaigns[vm.selected].name, function (people) {
            vm.people = people;
        });
        BeaconService.showInsights(vm.campaigns[vm.selected].name, startDate, endDate, function (totalHits) {
            vm.totalHits = totalHits;
            vm.endDate = new Date(vm.campaigns[vm.selected].data.endDate).toISOString().slice(0, 10);
            vm.created = new Date(vm.campaigns[vm.selected].created).toISOString().slice(0, 10);
        });

    }

}

