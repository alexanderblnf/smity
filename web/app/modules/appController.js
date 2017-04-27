'use strict';

angular
	.module('Smity')
	.controller('SmityController', [
		'$state',
		'$mdSidenav',
		'$q',
		'$timeout',
		'UradService',
        'SecurityService',
        'SharedVariables',
        SmityController]);

function SmityController($state, $mdSidenav, $q, $timeout, UradService, SecurityService, SharedVariables) {
	var vm = this;

	vm.go = go;
	vm.isState = isState;
	vm.openLeftMenu = openLeftMenu;
	vm.isInViewState = isInViewState;
	vm.logout = logout;
	vm.liveData = {};
	vm.remove = remove;
    vm.mapType = SharedVariables.getMapType();

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
				// LocalStorage.remove(Constants.AUTH.TOKEN);
				// SecurityService.clearCredentials();
				$state.go('login');
			});
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
		UradService.getAll().then(function (response) {
			vm.liveData = response;
			vm.liveData.pressure *= 0.00750061683;
			vm.liveData.pressure  = Math.round(vm.liveData.pressure);
		})
	}

	setInterval(getAll, 61000);

	function remove() {
		// var articleRow = angular.element($document.querySelector('#overview'));
		// articleRow.remove();
		console.log("Remove");
	}


}
