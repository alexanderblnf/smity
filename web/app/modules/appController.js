'use strict';

angular
    .module('Smity')
    .controller('SmityController', [
        '$state',
        '$mdSidenav',
        '$q',
        '$timeout',
        'ElasticService',
        'SecurityService',
        'SharedVariables',
        'IntelilightService',
        '$scope',
        '$rootScope',
        SmityController]);

function SmityController($state, $mdSidenav, $q, $timeout, ElasticService, SecurityService, SharedVariables, IntelilightService, $scope, $rootScope) {
    var vm = this;

    vm.go = go;
    vm.isState = isState;
    vm.openLeftMenu = openLeftMenu;
    vm.isInViewState = isInViewState;
    vm.logout = logout;
    vm.remove = remove;
    vm.setType = setType;
    vm.showDropdown = showDropdown;
    vm.addWidget = addWidget;

    vm.liveData = {};
    vm.mapType = SharedVariables.getMapType();
    vm.initHeatMap = SharedVariables.getInitHeatMap();
    vm.widgets = [];
    vm.measureUnits = SharedVariables.getMeasureUnits();
    vm.hideDropdown = false;
    vm.selected = undefined;
    vm.preferences = undefined;

    // invite friends
    var pendingSearch, lastSearch;

    _init();

    function _init() {
        getAll();
        SecurityService.loggedIn();
        vm.preferences = SharedVariables.getPreferences();
    }

    function go(state) {
        $state.go(state);
    }

    function isState(state) {
        return $state.includes(state);
    }

    function isInViewState() {
        return $state.params.id === undefined;
    }

    function openLeftMenu() {
        $mdSidenav('left').toggle();
    }

    function logout() {
        return SecurityService.logout()
            .then(function () {
                $state.go('login');
            });
    }

    function setType() {
        SharedVariables.setMapType();
        SharedVariables.setInitHeatMap();
        vm.mapType = SharedVariables.getMapType();

        $rootScope.$broadcast('map-changed');
    }

    function showDropdown() {
        vm.hideDropdown = !vm.hideDropdown;
    }


    function addWidget() {
        if (vm.selected) {
            vm.preferences = vm.preferences.concat(vm.widgets.filter(function (item) {
                if (item.name === vm.selected) {
                    return vm.preferences.indexOf(item) < 0;
                }
            }));

            SharedVariables.setPreferences(vm.preferences);

            showDropdown();
        }
    }

    // function _querySearch(criteria) {
    // 	return vm.allContacts.filter(_createFilterFor(criteria));
    // }
    // function searchUser(criteria) {
    // 	if (!pendingSearch || !debounceSearch()) {
    // 		return pendingSearch = $q(function (resolve) {
    // 			$timeout(function () {
    // 				resolve(_querySearch(criteria));
    // 				refreshDebounce();
    // 			}, Math.random() * 500, true)
    // 		});
    // 	}
    //
    // 	return pendingSearch;
    // }
    // function refreshDebounce() {
    // 	lastSearch = 0;
    // 	pendingSearch = null;
    // }
    //Debounce if querying faster than 300ms
    // function debounceSearch() {
    // 	var now = new Date().getMilliseconds();
    // 	lastSearch = lastSearch || now;
    //
    // 	return ((now - lastSearch) < 300);
    // }
    // function _createFilterFor(query) {
    // 	var lowercaseQuery = angular.lowercase(query);
    //
    // 	return function filterFn(contact) {
    // 		return (contact._lowername.indexOf(lowercaseQuery) != -1);
    // 	};
    // }
    // function _loadContacts() {
    // 	return vm.users.map(function (c) {
    // 		c.name = c.firstName + ' ' + c.lastName;
    // 		c._lowername = c.firstName.toLowerCase() + ' ' + c.lastName.toLowerCase();
    // 		return c;
    // 	});
    // }
    // function _loadEmails() {
    // 	return vm.selectedUsers.map(function (contact) {
    // 		return contact['email'];
    // 	});
    // }
    // function _loadEventsId() {
    // 	return vm.events.filter(function (event) {
    // 		if (event.selected) {
    // 			return event['id'];
    // 		}
    // 	})
    // }

    function getAll() {
        ElasticService.getAll().then(function (response) {
            delete response.$promise;
            delete response.$resolved;
            vm.liveData = response;
            vm.liveData.pressure *= 0.00750061683;
            vm.liveData.pressure = Math.round(vm.liveData.pressure);

            var keys = Object.keys(response);

            vm.widgets = [];
            for (var i = 0; i < keys.length; i++) {
                vm.widgets.push({
                    value: response[keys[i]],
                    name: _capitalize(keys[i]),
                    unit: vm.measureUnits[keys[i]],
                    link: keys[i]
                })
            }

        });
    }

    setInterval(getAll, 61000);

    function remove() {
        // var articleRow = angular.element($document.querySelector('#overview'));
        // articleRow.remove();
        console.log("Remove");
    }

    function _capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

}
