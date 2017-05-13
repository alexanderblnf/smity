'use strict';

angular.module('intelilight')
    .controller('IntelilightController', ['InteliMapService', IntelilightController]);

function IntelilightController(InteliMapService) {
    var vm = this;

    vm.closeWindow = closeWindow;

    _init();
    function _init() {
        InteliMapService.initMap();
    }

    function closeWindow() {
        document.getElementById('info-window').style.display = 'none';
    }
}