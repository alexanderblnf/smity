'use strict';

angular.module('Smity')
.directive('overview', function () {
	return {
		templateUrl:'/templates/overviewTemplate.html',
		scope: {
			parameterName: '@',
			parameterValue: '@',
			removeCallback: '&'
		},
		restrict: 'A',
		link: overviewLink
	};
	
	function overviewLink($scope) {
		$scope.remove = function () {
			$scope.removeCallback()();
		};
	}
});