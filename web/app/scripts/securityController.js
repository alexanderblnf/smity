'use strict';

angular
	.module('Smity')
	.controller('SecurityController', [
		'SecurityService',
		'LocalStorage',
		'Constants',
		'$state',
		SecurityController]);

function SecurityController(SecurityService, LocalStorage, Constants, $state) {
	var vm = this;

	vm.user = undefined;
	vm.pass = undefined;
	vm.registerUser = {};

	vm.login = login;
	vm.register = register;
	vm.isState = isState;
	vm.goTo = goTo;

	function login() {
		return SecurityService.login({email: vm.user, password: vm.pass})
			.then(function () {
				$state.go('home');
			});
	}

	function register() {
		return SecurityService.register(vm.registerUser)
			.then(function () {
				goTo('login');
			})
			.catch(function () {
				goTo('login');
			});
	}

	function isState(state) {
		return $state.includes(state);
	}

	function goTo(state) {
		return $state.go(state);
	}
}