'use strict';

angular.module('smity')
	.directive('overview', [function () {
        return {
            templateUrl: '/templates/smity/overviewTemplate.html',
            scope: {
                parameterName: '@',
                parameterValue: '@',
                parameterUnit: '@',
                removeCallback: '&',
                iconClass: '@',
                linkFunction: '@'
            },
            restrict: 'A',
            link: overviewLink
        };

        function overviewLink($scope) {
            $scope.remove = function () {
                $scope.removeCallback()($scope.parameterName);
            };
        }
    }]);