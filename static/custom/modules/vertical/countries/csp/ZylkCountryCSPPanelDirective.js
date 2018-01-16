define(function (require) {
    'use strict';

    var sequence = 1;
    var configService = require('horizontal/config/configService');

    function nextId() {
        return sequence++;
    }

    function ZylkCountryCSPPanelDirective() {
        //TODO get data from ajax in JSON files
        return {
            restrict: 'E',
            transclude: true,
            priority: -3,
            scope: {
                promise: '=',
                promises: '=',
                parameters: '=',
                country: '=',
                countryKey: '=',
                width: '=',
                height: '=',
                zoomW: '=',
                zoomH: '=',
                x:'=',
                y:'='
            },
            controller: ['$scope', 'configService', '$http', '$element', '$attrs', 'dataService', '$q', '$log',
                function ($scope, configService, $http, $element, $attrs, dataService, $q, $log) {
                var sectionId = nextId();
                $scope.width =  $scope.width || 250;
                $scope.height =  $scope.height || 250;
                $scope.zoomW =  $scope.zoomW || 1000;
                $scope.zoomH =  $scope.zoomH || 1000;
                $scope.cx =  $scope.x || 0;
                $scope.cy =  $scope.y || 0;
                $scope.countryKey = $scope.countryKey || 'EU';
                $scope.csp = true;

                $scope.esEU = $scope.countryKey=="EU";

                if(!$scope.esEU){
                    $scope.backStyle="background-color: #02449B; margin: 5px; height: 250px;";
                    $scope.backClass="col-xs-12"
                }
                else{
                    $scope.backClass="col-xs-12 boxEurope"
                }
                var promises = {};
                promises.promise1 = dataService.getCSPSingleCriteriaIndicators($scope.countryKey);
                promises.promise2 = dataService.getCSPDoubleCriteriaIndicators($scope.countryKey);

                /*Single Criteria*/
                //                14- Median Age-1
                //                66 Emloyement rate (age group 55-64)-2
                //                42 % of discrimination of Older Workers-3
                //                43 % of older workers (50+) who think they could continue doin their current job at 60-4
                /*Double Criteria*/
                //                28-M & F HLY) at 65

                var i18n = require('json!vertical/csp/i18n');
                $scope.i18n = i18n;

                $q.all(promises).then(function (promises) {

                    $log.debug("CSP-Panel promises-------------" + $scope.country);

                    $scope.indicators = {
                        id14: i18n.fig1,
                        id66: i18n.fig2,
                        id42: i18n.fig3,
                        id43: i18n.fig4,
                        id28: i18n.fig5,
                    };

                    $scope.singleCriteria = {};
                    $scope.singleCriteria.values = promises.promise1.data.resultset[0];
                    $scope.singleCriteria.metadata = promises.promise1.data.metadata;
                    $scope.singleCriteria.info = promises.promise1.data.queryInfo;

                    $scope.doubleCriteria = {};
                    $scope.doubleCriteria.values = {};
                    $scope.doubleCriteria.values.females = promises.promise2.data.resultset[0];
                    $scope.doubleCriteria.values.males = promises.promise2.data.resultset[1];
                    $scope.doubleCriteria.metadata = promises.promise2.data.metadata;
                    $scope.doubleCriteria.info = promises.promise2.data.queryInfo;

                    /*IC NO DATA*/
                    $log.debug("@@@@@@@@@@@@@@@@@@" + $scope.countryKey);
                    $log.debug($scope.doubleCriteria.values.females);


                    if($scope.singleCriteria.values[1]==-1 || $scope.singleCriteria.values[1]=="-1") {
                        $scope.singleCriteria.values[1]=i18n.na;
                    }else{
                        $scope.singleCriteria.values[1] += i18n.years;
                    }
                    if($scope.singleCriteria.values[2]==-1 || $scope.singleCriteria.values[2]=="-1") {
                        $scope.singleCriteria.values[2]=i18n.na;
                    } else {
                        $scope.singleCriteria.values[2]=$scope.singleCriteria.values[2]+"%";
                    }

                    if($scope.singleCriteria.values[3]==-1 || $scope.singleCriteria.values[3]=="-1") {
                        $scope.singleCriteria.values[3]=i18n.na;
                    } else {
                        $scope.singleCriteria.values[3] += "%";
                    }

                    if($scope.singleCriteria.values[4]==-1 || $scope.singleCriteria.values[4]=="-1") {
                        $scope.singleCriteria.values[4]=i18n.na;
                    } else {
                        $scope.singleCriteria.values[4]=$scope.singleCriteria.values[4]+"%";
                    }

                    if($scope.doubleCriteria.values.females[2]==-1 || $scope.doubleCriteria.values.females[2]=="-1") {
                        $scope.doubleCriteria.values.females[2]=i18n.na;
                    }else{
                        $scope.doubleCriteria.values.females[2] += i18n.years;
                    }

                    if($scope.doubleCriteria.values.males[2]==-1 || $scope.doubleCriteria.values.males[2]=="-1") {
                        $scope.doubleCriteria.values.males[2]=i18n.na;
                    }else{
                        $scope.doubleCriteria.values.males[2] += i18n.years;
                    }

                    $scope.panel = {
                        country: {
                            key: $scope.countryKey || 'RO',
                            id: 'panel-' + $scope.country + '-' + sectionId,
                            class: 'col-lg-12 marcar-layout clearfix row-container',
                            name: $scope.country || 'Europe',
                            shape: {
                                id: 'panel-shape-' + $scope.country + '-' + sectionId
                            }
                        },
                        'official-retirement': {
                            data: $scope.singleCriteria.values[1],
                            name: $scope.indicators.id14
                        },
                        'c': {
                            data: $scope.singleCriteria.values[2],
                            name: $scope.indicators.id66
                        },
                        'gap': {
                            data: $scope.singleCriteria.values[3],
                            name: $scope.indicators.id42
                        },
                        'quit-because-illness': {
                            data: $scope.singleCriteria.values[4],
                            name: $scope.indicators.id43
                        },
                        'long-standing-illness': {
                            name: $scope.indicators.id28,
                            data: {
                                females: $scope.doubleCriteria.values.females[2],
                                males: $scope.doubleCriteria.values.males[2]
                            }
                        },
                    };
                    if (['LT','DE', 'RO', 'NL'].indexOf($scope.countryKey) >= 0){
                        $scope.panel.link = true;
                    }

                });

            }],
            templateUrl: function (elem, attr) {
                if (attr.container == "EU") {
                    //('text!vertical/countries/directives/panel/template-eu');
                    return  configService.getVerticalDirectiveTplPath('countries/csp', 'panel-eu');
                } else {
                    //('text!vertical/countries/directives/panel/template');
                    return  configService.getVerticalDirectiveTplPath('countries/csp', 'panel');
                }
            }
        }
    }

    ZylkCountryCSPPanelDirective.$inject = [];

    return ZylkCountryCSPPanelDirective;
});
