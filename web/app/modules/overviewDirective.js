'use strict';

angular.module('Smity')
    .directive('overview', ['SharedVariables', function (SharedVariables) {
        return {
            templateUrl: '/templates/overviewTemplate.html',
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