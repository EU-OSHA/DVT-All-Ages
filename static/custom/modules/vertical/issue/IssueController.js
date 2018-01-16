/**
* @ngdoc controller
* @name all-ages.issue.controller:IssueController
* @requires $scope
* @requires $stateParams
* @requires $state
* @requires $document
* @description
* ############################################
*/
define(function (require) {
    'use strict';

    function controller($scope, $stateParams, $state, $log, issueService, dvtUtils, dataService, plotsProvider, $document, configService) {

        // Register a body reference to use later
        var bodyRef = angular.element( $document[0].body );

        //for labeltop function
        var pv = require('cdf/lib/CCC/protovis');

        $scope.historicalTemplate = configService.getVerticalTplPath('issue/partials/historical', 'olderWorkers');
        $scope.historical = $stateParams.historical || false;
        $scope.enableHistorical = function () {
            $state.go($state.current.name, {
                pCountry1: $scope.pCountry1,
                pCountry2: $scope.pCountry2,
                historical: true
            });
        };
        $scope.disableHistorical = function () {
            $state.go($state.current.name, {
                pCountry1: $scope.pCountry1,
                pCountry2: $scope.pCountry2,
                historical: false
            });
        };

        var i18n = require('json!vertical/issue/i18n');
        $scope.i18n = i18n;

        //$scope.param_country = $stateParams.param_country;
        $scope.promises = {};

        $scope.pCountry1 = $stateParams.pCountry1;
        $scope.pCountry2 = $stateParams.pCountry2;


        $scope.EUClass="";
        if($scope.pCountry2=="EU") {
            $scope.EUClass="colorEU";
        }

        $scope.dashboard = {};
        $scope.dashboard = {
            parameters: {
                "pCountry1": $scope.pCountry1,
                "pCountry2": $scope.pCountry2,
                "pColor1": dvtUtils.getColorCountry(1),
                "pColor2": dvtUtils.getColorCountry(2),
                "pColorEU": dvtUtils.getColorCountry(),
                "pColorEU2": dvtUtils.getEUColor(2),
                "pColor12": dvtUtils.getColorCountry(12),
                "pColor22": dvtUtils.getColorCountry(22)
            },
            "clickaction": function (dataset) {
                var data = dataset.datum.atoms.series.key;
                alert(data);
            },
            promises: {
                story2MainTotal: dataService.getOlderWorkersEmployment(),
                story2: [dataService.getMaleOlderWorkersEmployment(),dataService.getFemaleOlderWorkersEmployment()],
                story5: [
                    dataService.getDissatisfactionWorkingConditions35(),
                    dataService.getDissatisfactionWorkingConditions77()
                ]
            }
        };

        //TODO Utilizar el servicio en vez de hardcodeado.
        $scope.dashboard.cda = "all-ages/dashboards/issuedata.cda";
        $scope.dashboard.cda_datapilot = "all-ages/dashboards/datapilot.cda";
        $scope.dashboard.historicalCda = "all-ages/dashboards/issue_historical_data.cda";


        $log.debug('##########: ' + $state.current.name);
        $scope.refreshIssue = function () {
            if ($state.current.name !== undefined) {

                $state.go($state.current.name, {
                    pCountry1: $scope.pCountry1,
                    pCountry2: $scope.pCountry2
                });
            }
        };

        $scope.retirementAge = "retirementAge";
        $scope.olderWorkers = "olderWorkers";
        $scope.HLYvsLE = "HLYvsLE";

        var redirect = function () {

            var data = this.id!=undefined?this.id:this.getCategory();

            $scope.pCountry1 = data && data != 'undefined' ? data : "EU";
            $scope.pCountry2 = $scope.pCountry2 == data ? "EU": $scope.pCountry2 ;

            $state.go($state.current.name, {
                pCountry1: $scope.pCountry1,
                pCountry2: $scope.pCountry2
            });
        };

        // Conditional criteria
        var normalModeCriteriaText = function (dataset) {
            return dataset.datum.atoms.category2.value != -1?
                dataset.datum.atoms.category2.value.split("~")[0]
                : dataset.datum.atoms.category.value;        }

        var maxModeCriteriaText =  function(dataset) {
            return dataset.datum.atoms.category.value
        }

        $scope.stories = [
            //0
            {
                calculations: issueService.getStoryMainCalculations(1),
                plots: issueService.getStoryMainPlots(1,$scope.pCountry1,$scope.pCountry2),
                color: dvtUtils.getColorCountry(0),
                color2: dvtUtils.getColorCountry(-1),
                postfetch: plotsProvider.getDynamicColor,
                onClick: redirect,
                dimensions: {
                    series: {
                        isHidden:true
                    }
                },
                shortCriteria:{
                    normalModeCriteriaText: normalModeCriteriaText,
                    maxModeCriteriaText: maxModeCriteriaText,
                    dimensions: {
                        category2:{
                            isHidden:true
                        }
                    }
                }
            },
            //1
            {
                promises: $scope.dashboard.promises.story2

            },
            //2
            {
                color: dvtUtils.getColorCountry(-1),
                postfetch: plotsProvider.getDynamicColor,
                onClick: redirect,
                contextuals:{
                    normalModeCriteriaText: normalModeCriteriaText,
                    maxModeCriteriaText: maxModeCriteriaText,
                    dimensions: {
                        category2:{
                            isHidden:true
                        }
                    }
                }

            },
            //3
            {
                contextuals:{
                    normalModeCriteriaText: normalModeCriteriaText,
                    maxModeCriteriaText: maxModeCriteriaText,
                    dimensions: {
                        category2:{
                            isHidden:true
                        }
                    }
                }
            },
            //4
            {
                promises: $scope.dashboard.promises.story5,
                color: [dvtUtils.getColorCountry(0), dvtUtils.getColorCountry(-1)],
                postfetch: plotsProvider.getHLYDynamicColor,
                barFillStyle: plotsProvider.getHLYbarFillStyle($scope.dashboard),
                onClick: redirect,
                contextuals:{
                    normalModeCriteriaText: normalModeCriteriaText,
                    maxModeCriteriaText: maxModeCriteriaText,
                    dimensions:{
                        category2:{
                            isHidden:true
                        }
                    }
                }
            },
            //5:
            //Contextual indicators
            // GDP
            {
                plots: plotsProvider.getStoryConextualPlots(6),
                //  map virtual item columns -> dimensions
                readers: ['country, year, GDPgrouth, PIB'],
                // Data
                dimensions: {
                    GDPgrouth: {
                        format: "#,0"
                    },
                    PIB: {
                        format: "#,0.0"
                    }
                }
            },
            //6:
            //Old Ages Dependency Rates
            {
                labelTop: function (dataset) {

                    var height = this.chart.height - dataset.datum.atoms.value.value;
                    if (dataset.atoms.series.value == '2014') {
                        return height * 0.80;
                    } else {
                        return height * 0.30;
                    }
                },
                postfetch: plotsProvider.getHLYDynamicColor,
                dimensions: {
                    value: {
                        format : {
                            number: function (number) {
                                return number;
                            }
                        },
                        mask : '{value}'
                    }
                }
            },
            //Sickness Absences Analysis
            //7:
            {
                plots: plotsProvider.getDonoughtPlots(3),
                calculations: plotsProvider.getCalculations(7,$scope.pCountry2),
                postfetch: plotsProvider.getDonutsDynamicColor
            }
        ];


        var indicator, multi_title;
        switch ($state.current.name) {
            case 'issue-retirementAge':
                indicator = 57;
                multi_title = i18n.graphics_multiindicator.official_effective_retirement_age;
                break;
            case 'issue-olderWorkersEmployment':
                indicator = 66;
                break;
            case 'issue-challenges':
                indicator = 33;
                break;
            case 'issue-HLYvsLE':
                indicator = 16;
                multi_title = i18n.graphics_multiindicator.hly_vs_le_65;
                break;
            case 'issue-dissatisfaction':
                indicator = 35;
                multi_title = i18n.graphics_multiindicator.is5_main;
                break;
        }

        dataService.getStoryAndIndicatorMetadata(indicator)
            .then(function (metadata) {
                // TODO meter Indicator.StoryD
                // multi-indicator
                if (multi_title) {
                    $scope.story_title = multi_title;
                } else {
                    $scope.story_title = metadata.data.resultset[0][0];
                }
                $scope.story_description = metadata.data.resultset[0][1];
            });
    }

    controller.$inject = ['$scope', '$stateParams', '$state', '$log', 'issueService', 'dvtUtils', 'dataService', 'plotsProvider', '$document', 'configService'];
    return controller;
});
