'use strict';

angular.module('smity')
	.directive('overview', ['SecurityService', 'Constants', function (SecurityService, Constants) {
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

	        $scope.havePermission = function () {
		        return Constants.PERMISSIONS.indexOf(SecurityService.getCredentials().permissions) > -1;
	        }
        }
    }]);