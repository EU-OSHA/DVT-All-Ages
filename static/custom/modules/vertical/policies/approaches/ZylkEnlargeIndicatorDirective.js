define(function (require) {
    'use strict';

    var sequence = 1;
    var configService = require('horizontal/config/configService');

    function nextId() {
        return sequence++;
    }

    function ZylkEnlargeIndicatorDirective($stateParams, dataService, plotsProvider, $log, $timeout,$document) {
        //TODO get data from ajax in JSON files
        return {
            restrict: 'E',
            require: ['^zylkDashboard'],
            transclude: true,
            scope: {
                query: '=',
                cda: '=',
                postFetch1: '=',
                postFetch2: '=',
                postFetch3: '=',
                postFetch4: '=',
                type: '=',
                colorRole: '=',
                clickAction: '=',
                containerTitle: '=',
                axisFixedMin: '=',
                axisFixedMax: '=',
                axisPercent: '=',
                orthoAxisTitle:'=',
                step: '=',
                labelVisible: '=',
                labelTextAlign: '=',
                isMaximized:'=',
                isEnlarged:'=',
                id : '='
            },


            controller: ['$scope', '$element', '$attrs', '$stateParams',
                function ($scope, $element, $attrs, $stateParams) {
                    var i18n = require('json!vertical/approaches/i18n');
                    $scope.i18n = i18n;

                    $scope.dashboard = {};
                    $scope.dashboard.parameters = {
                        approach: $stateParams.pGroup.replace("group", "")
                    };

                    // enlarged legend
                    $attrs.showLegend = true;

                    if (!!$attrs.id) {
                        dataService.getIndicatorMetadata($attrs.id).then(function (metadata) {
                            $log.debug(metadata);
                            plotsProvider.showContextualData(metadata, [], $scope, $attrs);
                        });
                    }

                    if(!!$scope.labelVisible) {
                        $scope.visible = true;
                    }
                    else {
                        $scope.visible = false;
                        $scope.labelVisible = function(){return false;};
                    }


                }],
            templateUrl: configService.getVerticalDirectiveTplPath("policies/approaches", "enlarged")
        }
    }

    ZylkEnlargeIndicatorDirective.$inject = ['$stateParams', 'dataService', 'plotsProvider','$log','$timeout','$document'];

    return ZylkEnlargeIndicatorDirective;

});