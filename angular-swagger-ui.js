(function (angular) {
    'use strict';

    var app = angular.module('app', []);

    app.directive('suiGroup', function () {
        return {
            templateUrl: function (elem, attr) {
                return '/templates/group-template.html';
            }
        };
    });

    app.directive('suiEndpoint', function () {
        return {
            templateUrl: function (elem, attr) {
                return '/templates/endpoint-template.html';
            }
        };
    });

    app.controller('ui', ['$scope', '$http', function ($scope, $http) {
        $scope.groups = [];
        $scope.groupsMap = [];
        $http.get('http://petstore.swagger.io/v2/swagger.json').success(function (response) {
            $scope.json = response;
            angular.forEach($scope.json.paths, function (pathValue, pathKey) {
                angular.forEach(pathValue, function (endpointValue, endpointKey) {
                    angular.forEach(endpointValue.tags, function (tag) {
                        var group;
                        if (typeof $scope.groupsMap[tag] === 'undefined')
                        {
                            $scope.groupsMap[tag] = $scope.groups.length;
                            group = { name: tag, endpoints: [] };
                            $scope.groups.push(group);
                        }
                        else
                        {
                            group = $scope.groups[$scope.groupsMap[tag]];
                        }
                        group.endpoints.push({
                            path: pathKey,
                            http_method: endpointKey,
                            summary: endpointValue.summary,
                            parameters: endpointValue.parameters
                        });
                    });
                });
            });
        });
    }]);
})(angular);