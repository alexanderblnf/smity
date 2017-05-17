'use strict';

angular.module('beacon')
    .controller('BeaconController', ['BeaconService', BeaconController]);

function BeaconController(BeaconService) {
    var vm = this;

    vm.campaigns = [];
    vm.people = undefined;

    _init();
    function _init() {
        BeaconService.campaigns()
            .then(function (response) {

                // vm.campaigns = response;
                // vm.campaigns.map(function (campaign) {
                //     var name = campaign.name.replace("static/voucher/", "").slice(0,8);
                //     for (var i = name.length - 1; i >= 0; i--){
                //         if (name[i]=='-')
                //             name = name.slice(0, i);
                //     }
                //
                //
                // })
                vm.campaigns.push('Select');
                response.forEach(function (campaign) {
                    var name = campaign.name.replace("static/voucher/", "").slice(0, 8);
                    for (var i = name.length - 1; i >= 0; i--) {
                        if (name[i] == '-')
                            name = name.slice(0, i);
                    }
                    vm.campaigns.push(name);
                })
            });
    }

    function closeWindow() {
        document.getElementById('info-window').style.display = 'none';
    }
}