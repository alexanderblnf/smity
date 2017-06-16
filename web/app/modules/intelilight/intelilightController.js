'use strict';

angular.module('intelilight')
    .controller('IntelilightController', ['IntelilightService', IntelilightController]);

function IntelilightController(IntelilightService) {
    var vm = this;

    vm.closeWindow = closeWindow;

	vm.name = "Iluminat inteligent";

    _init();
    function _init() {
        IntelilightService.initMap();
    }

    function closeWindow() {
        document.getElementById('info-window').style.display = 'none';
    }
}