'use strict';

angular
	.module('auth')
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
			.then(function (response) {
				LocalStorage.put(Constants.AUTH.TOKEN, response);
				SecurityService.setCredentials(vm.user, vm.pass);
				$state.go('home');
			})
			.catch(function (response) {
				console.log(response);
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