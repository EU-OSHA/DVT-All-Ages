define(function (require) {
    'use strict';

    var sequence = 1;
    var configService = require('horizontal/config/configService');
    var i18n = require('json!vertical/countries/i18n');


    function nextId() {
        return sequence++;
    }

    function ZylkCountrySectionDirective($state, $stateParams, $http, dataService, $log, dvtUtils, countriesService, $compile) {

        //TODO get data from ajax in JSON files
        return {
            restrict: 'E',
            require: [],
            priority: 1001,
            transclude: true,
            scope: {
                data: '=',
                type: '=',
                country: '=',
                mapPromise: '=',
                groupList: '=',
                backgroundShapeColor: '=',
                groupColor: '=',
                promises: '=',
                parameters: '='
            },

            controller: ['$scope', '$element', '$attrs', '$stateParams',
                function ($scope, $element, $attrs, $stateParams) {

                    $scope.types = {
                        facts: i18n.section.ff,
                        grouping:i18n.section.grouping ,
                        context: i18n.section.context,
                        challenges: i18n.section.challenges,
                        stakeholders: i18n.section.stakeholders
                    };

                    $scope.types['main-initiatives']= i18n.section.policies;
                    $scope.types['other-initiatives']= i18n.section.iniciatives;

                    $scope.section = {
                        id: 'section-' + $attrs.type, // + '-' + sectionId,
                        country: $scope.country || $stateParams.pCountry1,
                        class: 'col-lg-12 clearfix row-container country',
                        caption: {
                            id: 'section-' + $attrs.type + '-caption',
                            class: 'col-lg-12',
                            name: $scope.types[$attrs.type]
                        },
                        content: {
                            id: 'section-' + $attrs.type + '-content',
                            class: ($attrs.type == 'grouping' && (!$attrs.compare || $attrs.compare === undefined))? "col-lg-6":"col-lg-12"
                        }
                    };
                }],
            templateUrl: function (elem, attr) {
                if (attr.type == "grouping") {
                    return  configService.getVerticalDirectiveTplPath("countries/country-insight/partials", "section.grouping");
                } else {
                    return  configService.getVerticalDirectiveTplPath("countries/country-insight/partials", "section");
                }
            },
            link: function (scope, element, attributes) {

                // TODO El default debería Estar aquí???
                if (!attributes.compare || attributes.compare === undefined || attributes.compare === "1") {
                    var country = $stateParams.pCountry1 || 'RO';
                    $log.debug('Country1: ' + country);
                } else if (attributes.compare == "2") {
                    var country = $stateParams.pCountry2 || 'RO';
                    $log.debug('Country2: ' + country);
                }
                
                switch (attributes.type) {
                    case "facts":
                        var sectionId = nextId();
                        $log.error("Facts & figures on country cards/comparison html template ");
                        break;

                    case "grouping":
                        countriesService.buildGroupingBlocks(scope, country, element, attributes);
                        break;

                    case "main-initiatives":
                        countriesService.buildPolicyBlocks(scope, country, element, attributes);
                        break;

                    case "other-initiatives":
                        countriesService.buildOthersInitiativesBlocks(scope, country, element, attributes);
                        break;

                    case "context":
                        countriesService.buildCircumstancesBlocks(scope, country, element, attributes);
                        break;

                    case "challenges":
                        countriesService.buildChallengesBlocks(scope, country, element, attributes);
                        break;

                    case "stakeholders":
                        countriesService.buildStakeHoldersBlocks(scope, country, element, attributes);
                        break;
                }

                if (attributes.colorIndex) {
                    scope.colorIndex = attributes.colorIndex;
                }

            }
        }
    }

    ZylkCountrySectionDirective.$inject = ['$state', '$stateParams', '$http', 'dataService', '$log', 'dvtUtils', 'countriesService', '$compile'];

    return ZylkCountrySectionDirective;

});