'use strict';

angular
	.module('auth')
	.controller('SecurityController', [
		'SecurityService',
		'$state',
		SecurityController]);

function SecurityController(SecurityService, $state) {
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
                $state.go('app.home');
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
			.catch(function (response) {
				console.log(response);
			});
	}

	function isState(state) {
		return $state.includes(state);
	}

	function goTo(state) {
		return $state.go(state);
	}
}