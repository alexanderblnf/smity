'use strict';

angular.module('elastic')
	.factory('ElasticResource', ['$resource', 'Constants', ElasticResource]);

function ElasticResource($resource, Constants) {
	return $resource(Constants.URL.LOCALHOST + '/elastic/livemeans', {}, {
		'live': {
			method: 'GET'
        },
        'predict': {
            method: 'GET',
            url: Constants.URL.LOCALHOST + '/elastic/:param/prediction/:time'
        },
        'heatmap': {
            method: 'GET',
	        url: Constants.URL.LOCALHOST + '/elastic/heatmapdata/:param/:timeStart/:timeEnd',
            isArray: true
		}
	})
}