'use strict';

angular
	.module('Smity')
	.factory('EventResource', ['$resource', 'Constants', 'SecurityService', function ($resource, Constants, SecurityService) {
		return $resource('http://46.101.218.125:8080/events', {}, {
			'getEvents': {
				method: 'GET'
			},
			'getEvent': {
				method: 'GET',
				url: Constants.URL.API + '/event/:id'
			},
			'updateEvent': {
				method: 'POST',
				url: Constants.URL.API + '/event/:id'
			},
			'createEvent': {
				method: 'POST',
				url: Constants.URL.API + '/event',
				headers: {
					'Authorization': SecurityService.getToken(),
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			},
			'inviteFriends': {
				method: 'POST',
				url: Constants.URL.API + '/event/:eventId/invite'
			},
			'getUsers': {
				method: 'GET',
				url: Constants.URL.API + '/users'
			},
			'uploadPhoto': {
				method: 'POST',
				url: Constants.URL.API + 'event/:eventId/photo'
			}
		});
	}]);