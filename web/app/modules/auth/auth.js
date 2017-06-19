'use strict';

angular
	.module('auth', ['ngResource', 'ngCookies'])
	.config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/dashboard');

			$stateProvider
				.state('login', {
					url: '/login',
					templateUrl: '/templates/auth/login.html',
                    controller: 'SecurityController as vm'
				})
				.state('register', {
					url: '/register',
					templateUrl: '/templates/auth/register.html',
					controller: 'SecurityController as vm'
				})
                .state('member', {
                    url: '/member',
	                templateUrl: '/templates/auth/register.html',
                    controller: 'SecurityController as vm'
                });

        }]);