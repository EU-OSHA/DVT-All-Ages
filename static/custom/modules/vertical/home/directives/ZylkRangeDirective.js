define(function (require) {
    'use strict';

    var sequence = 1;
    var configService = require('horizontal/config/configService');


    function nextId() {
        return sequence++;
    }

    function ZylkRangeDirective($log, $timeout) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            require: ['ngModel', '^zylkDashboard'],
            replace: true,
            templateUrl: configService.getVerticalDirectiveTplPath("home/directives", "range"),
            link: function (scope, element, attributes, controllers) {
                var ngModel = controllers[0];
                var dashboard = controllers[1];

                scope.items = attributes.values.split(", ");
                scope.default = attributes.default;
                scope.value = attributes.default;
                scope.range = "";
                scope.pyramid = {
                    value: scope.items[0],
                    action: scope.updatePyramid
                };

                scope.updatePyramid = function (value) {
                    $log.info("RANGE updatePyramid: " + value + " : " + scope.items[value]);
                    dashboard.dashboard.fireChange('pYears', scope.items[value]);
                };

                scope.slide = function (value) {
                    scope.updatePyramid(value);
                    scope.range.val(value.toString());
                    scope.rangeSelected = value;
                };
                
                $timeout(function () {
                    scope.range = $('input#pyramid-range.ng-pristine.ng-valid');
                    scope.range.val(scope.items.indexOf(scope.default).toString());
                    scope.rangeSelected = scope.items.indexOf(scope.default);
                }, 300);
            }
        }
    }

    ZylkRangeDirective.$inject = ['$log', '$timeout'];

    return ZylkRangeDirective;
});


