'use strict';

angular.module('Smity')
.directive('overview', function () {
	return {
		templateUrl:'/templates/overviewTemplate.html',
		scope: {
			parameterName: '@',
			parameterValue: '@',
            parameterUnit: '@',
            removeCallback: '&',
            iconClass: '@',
            link: '@'
		},
		restrict: 'A',
		link: overviewLink
	};

    function overviewLink($scope, $el) {
		$scope.remove = function () {
            $el.remove();
		};
	}
});