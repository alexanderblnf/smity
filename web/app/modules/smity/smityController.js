'use strict';

angular
    .module('smity')
	.controller('SmityController', [
		'$state',
		'$mdSidenav',
		'ElasticService',
		'SecurityService',
		'SharedVariables',
		'PreferenceService',
		SmityController]);

function SmityController($state, $mdSidenav, ElasticService, SecurityService, SharedVariables, PreferenceService) {
	var vm = this;

	vm.go = go;
	vm.isState = isState;
	vm.openLeftMenu = openLeftMenu;
	vm.isInViewState = isInViewState;
	vm.logout = logout;
	vm.remove = remove;
	vm.showDropdown = showDropdown;
	vm.addWidget = addWidget;

	vm.measureUnits = SharedVariables.getMeasureUnits();
	vm.names = SharedVariables.getNames();
	vm.liveData = {};
	vm.widgets = undefined;
	vm.hideDropdown = false;
	vm.selected = undefined;
	vm.preferences = [];
	vm.userPreferences = undefined;
	vm.name = "Overview";

	_init();

	function _init() {
		getAll();
		SecurityService.loggedIn();
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

	function showDropdown() {
		vm.hideDropdown = !vm.hideDropdown;
	}


	function addWidget() {
		if (vm.selected) {
			vm.userPreferences.push(vm.selected);
			PreferenceService.update(vm.userPreferences)
				.then(function (response) {
					if (response.code === 200) {
						console.log('Succes');
					}
				});

			vm.preferences = vm.preferences.concat(vm.widgets.filter(function (item) {
				if (item.name === vm.selected) {
					return vm.preferences.indexOf(item) < 0;
				}
			}));

			showDropdown();
		}
	}

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
					name: vm.names[keys[i]],
					unit: vm.measureUnits[keys[i]],
					link: keys[i]
				})
			}

			vm.preferences = [];

			getPreferences();

		});
	}

	function getPreferences() {
		PreferenceService.getAll()
			.then(function (response) {
				vm.userPreferences = response.message;
				vm.userPreferences.forEach(function (selected) {
					vm.preferences = vm.preferences.concat(vm.widgets.filter(function (item) {
						return item.link === selected;
					}));
				});
			});
	}

	setInterval(getAll, 61000);

	function remove(parameterName) {
		var indexToRemove;

		vm.preferences.filter(function (item, index) {
			if (item.name === parameterName) {
				indexToRemove = index;
				return index;
			}
		});

		vm.preferences.splice(indexToRemove, 1);
		vm.userPreferences.splice(vm.userPreferences.indexOf(parameterName), 1);
		PreferenceService.update(vm.userPreferences)
			.then(function (response) {
				console.log('Succes');
			});
	}
}
