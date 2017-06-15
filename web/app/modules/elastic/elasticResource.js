'use strict';

angular.module('elastic')
	.factory('ElasticResource', ['$resource', 'Constants', ElasticResource]);

function ElasticResource($resource, Constants) {
	return $resource(Constants.URL.SERVER + '/elastic/livemeans', {}, {
		'liveMeans': {
			method: 'GET'
        },
        'predict': {
            method: 'GET',
	        url: Constants.URL.SERVER + '/elastic/:param/prediction/:time'
        },
        'heatmap': {
            method: 'GET',
	        url: Constants.URL.SERVER + '/elastic/heatmapdata/:param/:timeStart/:timeEnd',
            isArray: true
        },
        'weekly': {
            method: 'GET',
	        url: Constants.URL.SERVER + '/elastic/weekly/:param',
            isArray: true
        }
	})
}