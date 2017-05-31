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
		'$rootScope', 'PreferenceService',
		SmityController]);

function SmityController($state, $mdSidenav, $q, $timeout, ElasticService, SecurityService, SharedVariables,
                         IntelilightService, $scope, $rootScope, PreferenceService) {
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

	// invite friends
	var pendingSearch, lastSearch;

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

	function _capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

}
