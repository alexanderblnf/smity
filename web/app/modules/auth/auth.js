'use strict';

angular
	.module('auth', ['ngResource', 'ngCookies'])
	.config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/');

			$stateProvider
				.state('login', {
					url: '/login',
					templateUrl: '/templates/login.html',
                    controller: 'SecurityController as vm'
				})
				.state('register', {
						url: '/register',
						templateUrl: '/templates/register.html',
                    controller: 'SecurityController as vm'
                })
                .state('member', {
                    url: '/member',
                    templateUrl: '/templates/register.html',
                    controller: 'SecurityController as vm'
                });

        }]);