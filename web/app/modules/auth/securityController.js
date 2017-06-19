'use strict';

angular
	.module('auth')
	.controller('SecurityController', [
		'SecurityService',
		'$state',
		'Constants',
		'$rootScope',
		SecurityController]);

function SecurityController(SecurityService, $state, Constants, $rootScope) {
	var vm = this;

	vm.user = undefined;
	vm.pass = undefined;
	vm.registerUser = {};

	vm.login = login;
	vm.register = register;
    vm.addMember = addMember;
	vm.goTo = goTo;
	vm.isState = isState;

	function login() {
		return SecurityService.login({email: vm.user, password: vm.pass})
			.then(function (response) {
				SecurityService.setCredentials(response.firstname, response.lastname, response.permission);
                $state.go('app.home');
			})
			.catch(function (response) {
				console.log(response);
			});
	}

	function register() {
		return SecurityService.register(vm.registerUser)
			.then(function () {
				$state.go('login');
			})
            .catch(function (response) {
                console.log(response);
			});
	}

    function addMember() {
        return SecurityService.addMember(vm.registerUser)
            .then(function () {
	            $state.go('app.home');
            })
            .catch(function (response) {
                console.log(response);
            });
    }

	function goTo(state) {
		$state.go(state);
	}

	function isState(state) {
		return $state.includes(state);
	}


}