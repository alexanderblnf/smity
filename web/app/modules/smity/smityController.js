'use strict';

angular
	.module('smity')
	.controller('SmityController', [
		'$state',
		'ElasticService',
		'SecurityService',
		'PreferenceService',
		'Constants',
		'$rootScope',
		SmityController]);

function SmityController($state, ElasticService, SecurityService, PreferenceService, Constants, $rootScope) {
	var vm = this;

	vm.go = go;
	vm.logout = logout;
	vm.showDropdown = showDropdown;
	vm.addWidget = addWidget;
	vm.removeWidget = removeWidget;
	vm.haveAdminPermission = haveAdminPermission;
	vm.havePermission = havePermission;

	var userPreferences = undefined;
	var user = SecurityService.getCredentials();
	var permissions = user.permissions;

	vm.widgets = undefined;
	vm.dropdown = false;
	vm.selected = undefined;
	vm.preferences = [];
	vm.name = "Overview";
	vm.username = user.username;

	_getAll();

	function _getAll() {
		ElasticService.liveMeans()
			.then(function (response) {
				delete response.$promise;
				delete response.$resolved;

				response.pressure *= 0.00750061683;
				response.pressure = Math.round(response.pressure);

				var keys = Object.keys(response);

				vm.widgets = [];
				for (var i = 0; i < keys.length; i++) {
					if (keys[i] === 'pressure') {
						vm.widgets.push({
							value: response[keys[i]],
							name: Constants.NAMES[keys[i]],
							unit: 'mmHg',
							link: keys[i]
						})
					} else {
						vm.widgets.push({
							value: response[keys[i]],
							name: Constants.NAMES[keys[i]],
							unit: Constants.UNITS[keys[i]],
							link: keys[i]
						})
					}
				}
				_getPreferences();
			});
	}

	function _getPreferences() {
		PreferenceService.getAll()
			.then(function (response) {
				vm.preferences = [];

				userPreferences = response;
				userPreferences.forEach(function (selected) {
					vm.preferences = vm.preferences.concat(vm.widgets.filter(function (item) {
						return item.link === selected;
					}));
				});
			});
	}

	setInterval(_getAll, 18001);

	function showDropdown() {
		vm.dropdown = !vm.dropdown;
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

	function go(state) {
		$state.go(state);
	}

	function logout() {
		return SecurityService.logout()
			.then(function () {
				$state.go('login');
			});
	}

	function haveAdminPermission() {
		return Constants.ADD_MEMBER.indexOf(permissions) > -1;
	}

	function havePermission() {
		return Constants.PERMISSIONS.indexOf(permissions) > -1;
	}
}
