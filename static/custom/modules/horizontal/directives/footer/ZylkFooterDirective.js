/**
 * @ngdoc directive
 * @name dvt.directive:ZylkFooter
 * @scope
 * @restrict E
 *
 * @description
 * A description of the directive
 *
 */
define(function (require) {
    'use strict';

    var sequence = 1;
    var configService = require('horizontal/config/configService');


    function nextId() {
        return sequence++;
    }

    // Ver:  https://docs.angularjs.org/api/ng/type/ngModel.NgModelController
    function ZylkFooterDirective($log) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            controller: ['$scope', 'configService', '$http', function($scope, configService, $http) {
                $scope.path = configService.getHorizontalDirectiveDataPath("footer", "footer");
                $http.get($scope.path).success(function(footer) {
                    $log.debug(footer)
                    $scope.footer = footer;
                    $scope.CurrentDate = new Date();
                    $scope.debugEnabled = (typeof document == "undefined" || document.location.href.indexOf("debug=true") > 0);
                }).error(function(data,error){
                    //TODO process error
                });
            }],
            templateUrl: configService.getHorizontalDirectiveTplPath("footer", "footer")
            // css: configService.getHorizontalDirectiveStylePath("footer", "footer"),
        }
    }

    ZylkFooterDirective.$inject = ['$log'];

    return ZylkFooterDirective;
});
