'use strict';

angular.module('urad')
	.factory('UradResource', ['$resource', 'Constants', UradResource]);

function UradResource($resource, Constants) {
	return $resource(Constants.URL.LOCALHOST + '/elastic/livemeans', {}, {
		'live': {
			method: 'GET'
        },
        'predict': {
            method: 'GET',
            url: Constants.URL.LOCALHOST + '/elastic/82000034/:param/prediction/:time'
		}
	})
}