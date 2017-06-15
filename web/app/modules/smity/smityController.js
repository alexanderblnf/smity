'use strict';

angular
	.module('smity')
	.controller('SmityController', [
		'$state',
		'ElasticService',
		'SecurityService',
		'PreferenceService',
		'Constants',
		SmityController]);

function SmityController($state, ElasticService, SecurityService, PreferenceService, Constants) {
	var vm = this;

	vm.go = go;
	vm.logout = logout;
	vm.showDropdown = showDropdown;
	vm.addWidget = addWidget;
	vm.removeWidget = removeWidget;

	var measureUnits = Constants.UNITS;
	var names = Constants.NAMES;
	var userPreferences = undefined;

	vm.widgets = undefined;
	vm.hideDropdown = false;
	vm.selected = undefined;
	vm.preferences = [];
	vm.name = "Overview";


	_getAll();

	function _getAll() {
		ElasticService.liveMeans()
			.then(function (response) {
				delete response.$promise;
				delete response.$resolved;

				var keys = Object.keys(response);

				vm.widgets = [];
				for (var i = 0; i < keys.length; i++) {
					vm.widgets.push({
						value: response[keys[i]],
						name: names[keys[i]],
						unit: measureUnits[keys[i]],
						link: keys[i]
					})
				}
				_getPreferences();
			});
	}

	function _getPreferences() {
		PreferenceService.getAll()
			.then(function (response) {
				vm.preferences = [];

				userPreferences = response.message;
				userPreferences.forEach(function (selected) {
					vm.preferences = vm.preferences.concat(vm.widgets.filter(function (item) {
						return item.link === selected;
					}));
				});
			});
	}

	setInterval(_getAll, 61000);

	function go(state) {
		$state.go(state);
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
			userPreferences.push(vm.selected);
			PreferenceService.update(userPreferences)
				.then(function (response) {
					if (response.code === 200) {
						console.log('Succes');
					}
				});

			vm.preferences = vm.preferences.concat(vm.widgets.filter(function (item) {
				if (item.link === vm.selected) {
					return vm.preferences.indexOf(item) < 0;
				}
			}));

			showDropdown();
		}
	}

	function removeWidget(parameterName) {
		var indexToRemove;

		vm.preferences.filter(function (item, index) {
			if (item.name === parameterName) {
				indexToRemove = index;
				return index;
			}
		});

		vm.preferences.splice(indexToRemove, 1);
		userPreferences.splice(userPreferences.indexOf(parameterName), 1);
		PreferenceService.update(userPreferences)
			.then(function (response) {
				console.log('Succes');
			});
	}
}
