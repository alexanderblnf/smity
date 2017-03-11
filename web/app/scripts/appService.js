'use strict';

angular
	.module('Smity')
	.service('EventService', ['EventResource', 'Constants', '$http', function (EventResource, Constants, $http) {
		return {
			createEvent: createEvent,
			getEvents: getEvents,
			getEvent: getEvent,
			updateEvent: updateEvent,
			getUsers: getUsers,
			inviteFriends: inviteFriends,
			uploadPhoto: uploadPhoto
		};

		function createEvent(event) {
			return EventResource
				.createEvent({name: event.name,
					location: event.location,
					date: event.date.toDateString()})
				.$promise;

			// return $http.post(Constants.URL.API + '/event', {name: event.name,
			// 			location: event.location,
			// 			date: event.date.toDateString()});
		}

		function getEvents() {
			return EventResource.getEvents().$promise;
		}

		function getEvent(id) {
			return EventResource.getEvent({id: id}).$promise;
		}

		function updateEvent(id, event) {
			return EventResource.updateEvent({id: id}).$promise;
		}

		function getUsers() {
			return EventResource.getUsers().$promise;
		}

		function inviteFriends(eventId, users) {
			return EventResource.inviteFriends({eventId: eventId}, users).$promise;
		}

		function uploadPhoto(eventId, fileName) {
			return EventResource.uploadPhoto({eventId: eventId}, fileName).$promise;
		}
	}]);
