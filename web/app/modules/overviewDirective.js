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

        function overviewLink($scope, $el) {
            var preferences = SharedVariables.getPreferences();

            $scope.remove = function () {
                preferences.splice(function () {
                    return preferences.filter(function (item, index) {
                        if (item.name === $scope.parameterName) return index;
                    })
                }, 1);

                SharedVariables.setPreferences(preferences);
            };
        }
    }]);