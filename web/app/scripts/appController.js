'use strict';

angular
	.module('Smity')
	.controller('EvShareController', [
		'$state',
		'EventService',
		'$mdSidenav',
		'$q',
		'$timeout',
		'SecurityService',
		EvShareController]);

function EvShareController($state, EventService, $mdSidenav, $q, $timeout, SecurityService) {
	var vm = this;

	vm.go = go;
	vm.isState = isState;
	vm.createEvent = createEvent;
	vm.openLeftMenu = openLeftMenu;
	vm.isInViewState = isInViewState;
	vm.logout = logout;

	// event
	vm.selected = undefined;
	vm.event = {};

	// invite friends
	var pendingSearch, lastSearch;

	vm.selectedUsers = [];
	vm.totalUsers = undefined;
	vm.users = [{firstName: 'Andra', lastName: 'Ionescu', email: 'andra@gmail.com'},
		{firstName: 'Teodor', lastName: 'Stefu', email: 'tedi@gmail.com'},
		{firstName: 'Adrian', lastName: 'Tanase', email: 'adi@gmail.com'},
		{firstName: 'Vlad', lastName: 'Postoaca', email: 'vlad@gmail.com'}];
	vm.allContacts = _loadContacts();

	vm.searchUser = searchUser;
	vm.invite = invite;

	// upload photo
	vm.fileName = undefined;
	vm.bine = undefined;

	vm.upload = upload;

	//_init();

	function _init() {
		EventService.getUsers()
			.then(function (response) {
				vm.users = response.listUserResponse;
				vm.totalUsers = response.count;
			});

		EventService.getEvents()
			.then(function (response) {
				vm.events = response.events;
				vm.totalEvents = response.totalEvents;

				_loadEvents();
			})
	}

	function go(state) {
		$state.go(state);
	}

	function isState(state) {
		return $state.includes(state);
	}

	function createEvent() {
		EventService.createEvent(vm.event)
			.then(function () {
				$state.go('home.show');
				vm.event = {};
			});

		$state.go('home.show');
		vm.event = {};
	}

	function isInViewState() {
		return $state.params.id === undefined;
	}

	function openLeftMenu() {
		$mdSidenav('left').toggle();
	}

	function _querySearch(criteria) {
		return vm.allContacts.filter(_createFilterFor(criteria));
	}

	function searchUser(criteria) {
		if (!pendingSearch || !debounceSearch()) {
			return pendingSearch = $q(function (resolve) {
				$timeout(function () {
					resolve(_querySearch(criteria));
					refreshDebounce();
				}, Math.random() * 500, true)
			});
		}

		return pendingSearch;
	}

	function refreshDebounce() {
		lastSearch = 0;
		pendingSearch = null;
	}

	//Debounce if querying faster than 300ms
	function debounceSearch() {
		var now = new Date().getMilliseconds();
		lastSearch = lastSearch || now;

		return ((now - lastSearch) < 300);
	}

	function _createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);

		return function filterFn(contact) {
			return (contact._lowername.indexOf(lowercaseQuery) != -1);
		};
	}

	function _loadContacts() {
		return vm.users.map(function (c) {
			c.name = c.firstName + ' ' + c.lastName;
			c._lowername = c.firstName.toLowerCase() + ' ' + c.lastName.toLowerCase();
			return c;
		});
	}

	function _loadEvents() {
		return vm.events.map(function (event) {
			event.selected = false;
			return event;
		})
	}

	function _loadEmails() {
		return vm.selectedUsers.map(function (contact) {
			return contact['email'];
		});
	}

	function _loadEventsId() {
		return vm.events.filter(function (event) {
			if (event.selected) {
				return event['id'];
			}
		})
	}

	function invite() {
		var events = _loadEventsId();

		events.forEach(function (ev) {
			EventService.inviteFriends(ev.id, _loadEmails())
				.then(function (response) {
					console.log('Success');
				});
		});

		vm.selectedUsers = [];
		_resetEvents();
	}

	function _resetEvents() {
		return vm.events.map(function (ev) {
			ev.selected = false;
			return ev;
		})
	}

	function upload() {
		EventService.uploadPhoto($state.params.id, vm.fileName)
			.then(function () {
				vm.fileName = undefined;
			});

		vm.fileName = undefined;
	}

	function logout() {
		return SecurityService.logout()
			.then(function () {
				$state.go('login');
			});
	}
}
