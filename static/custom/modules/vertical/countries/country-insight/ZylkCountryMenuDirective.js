define(function (require) {
    'use strict';

    var sequence = 1;

    // TODO inyectar
    var configService = require('horizontal/config/configService');



    function nextId() {
        return sequence++;
    }

    // Ver:  https://docs.angularjs.org/api/ng/type/ngModel.NgModelController

    function ZylkCountryMenuDirective() {

        var i18n = require('json!vertical/countries/i18n');
        return {
            restrict: 'E'
            , transclude: true
            , priority: -1
            , scope: {
                class: '@class'
                , promise: '='
                , promises: '='
                , refreshHash: '='
                , country: '='
                , colors: '='
                , params: '='
            }
            , controller: ['$scope', '$state', '$stateParams', 'configService', '$http', '$attrs', 'dataService','$log',
                function ($scope, $state, $stateParams, configService, $http, $attrs, dataService, $log) {

                    var sectionId = nextId();
                    $scope.country = $stateParams.pCountry1;
                    $scope.countryName = "Spain";
                    $scope.width = $attrs.width || 200;
                    $scope.height = $attrs.height || 250;
                    $scope.zoomW = $attrs.zoomW || 500;
                    $scope.zoomH = $attrs.zoomH || 500;
                    $scope.x = $attrs.x || 0;
                    $scope.y = $attrs.y || 0;

                    $scope.i18n = i18n;

                    var country=$scope.country || $stateParams.pCountry1;

                    dataService.getLinkReport(country)
                        .then(function (dataset) {
                            $log.debug('linkReport: ' + dataset.data.resultset.length);
                            dataset.data.resultset.forEach(function(linkReport) {
                                $log.debug('linkReport value: ' + linkReport[0]);
                                var elemento = document.getElementById('linkReport');
                                elemento.setAttribute("href", linkReport[0]);

                            });
                        })
                        .catch(function (err) {
                            $log.warn("Link Report data request --> link fail!");
                        });

                    dataService.getLinkInfographics(country)
                        .then(function (dataset) {
                            dataset.data.resultset.forEach(function(linkInfographics) {
                                $log.debug('linkInfographics value: ' + linkInfographics[0]);
                                var elemento = document.getElementById('linkInfographics');
                                var link = linkInfographics[0];
                                link = link.replace(" ", "");
                                link = "/pentaho/plugin/pentaho-cdf-dd/api/resources/system/all-ages/static/custom/img/additional-resources/pdf/" + link + ".pdf";
                                elemento.setAttribute("href", link);

                            });
                        })
                        .catch(function (err) {
                            $log.warn("Link infographics data request --> link fail!");
                        });

            }]
            , templateUrl: configService.getVerticalPath() + 'countries/country-insight/partials/menu.html'
        }
    }

    ZylkCountryMenuDirective.$inject = [];

    return ZylkCountryMenuDirective;
});
