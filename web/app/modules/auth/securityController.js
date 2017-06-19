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
    vm.addMember = addMember;
	vm.goTo = goTo;
	vm.isState = isState;
	vm.havePermission = havePermission;

	function login() {
		return SecurityService.login({email: vm.user, password: vm.pass})
			.then(function (response) {
				SecurityService.setCredentials();
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
        vm.registerUser['userid'] = 2;

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

	function havePermission() {

	}
}