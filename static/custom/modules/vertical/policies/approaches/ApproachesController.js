/**
 * @ngdoc controller
 * @name all-ages.policies.controller:ApproachesController
 * @requires $scope
 * @requires $stateParams
 * @requires $state
 * @requires $log
 * @requires configService
 * @requires dataService
 * @requires mapProvider
 * @requires dvtUtils
 * @requires approachService
 * @requires $document
 * @description
 * #
 */
define(function (require) {
    'use strict';

    function controller($scope, $stateParams, $state, $log, configService, dataService, mapProvider, dvtUtils, approachService, $document, $window, $cookies) {

        var i18n = require('json!vertical/approaches/i18n');
        $scope.i18n = i18n;

        /*Building dashboard*/
        $scope.dashboard = {};
        $scope.dashboard.parameters = {
            approach: $stateParams.pGroup.replace("group", ""),
            pEurope: "EU",
            color1: dvtUtils.getGroupColor("1"),
            color2: dvtUtils.getGroupColor("2"),
            color3: dvtUtils.getGroupColor("3"),
            color4: dvtUtils.getGroupColor("4")
        };

        $scope.dashboard.promises = {
            promiseShape: mapProvider.getEuropeShape(),
            tab2MainPolicies: dataService.getAPTab2MainPolicies(parseInt($stateParams.pGroup.replace("group", ""))),
            tab1GroupDescription: dataService.getAPTab1GroupDesc(parseInt($stateParams.pGroup.replace("group", ""))),
            countryGroups: dataService.getGroupCountryList()
        };

        $scope.dashboard.cda = dvtUtils.setCDAIn("CA");

        $scope.dashboard.promises.countryGroups
            .then(function (result) {
                $scope = dataService.createGroupCountryList($scope, result.data);
            });

        /* Get map click action */
        $scope.map = {
            clickAction: mapProvider.getCommonClickAction
        };

        /* GET COLORS */

        dvtUtils.fixGroupColor($stateParams.pGroup.replace("group", ""), $scope);

        /**
         * @ngdoc method
         * @name ng.controller:ApproachesController#fixColorMap
         * @param {string} carl is awesome
         * @methodOf all-ages.policies.controller:ApproachesController
         * @description
         * My Description rules
         */
        $scope.fixColorMap = function () {
            dvtUtils.fixGroupColor($stateParams.pGroup.replace("group", ""), $scope);
            var component = this;
            var dashboard = component.dashboard;
            var color = dashboard.getParameterValue("pGroupColor");
            var colorEU = dashboard.getParameterValue("pEUColor");
            var europe = dashboard.getParameterValue("pEurope");
            component.chartDefinition.colors = [color];
            component.chartDefinition.colorMap[europe] = colorEU;
        };

        /**
         * @ngdoc method
         * @name ng.controller:ApproachesController#refreshHash
         * @methodOf all-ages.policies.controller:ApproachesController
         * @description
         * My Description rules
         */
        $scope.refreshHash = function () {
            $state.go('approaches-indicators', {
                pGroup: "group" + $scope.dashboard.parameters.approach
            });
        };

        /* GET DATA */

        approachService.getTab2MainPoliciesData($scope);

        approachService.getTab1GroupDescriptionData($scope);

        /* ENLARGE */

        $scope.indicators = approachService.getIndicatorList($scope, $state);
        $scope.indicatorIndex = $stateParams.indicator;
        $scope.enlarge = {
            labelVisible: function (d) {
                $log.debug("@@@@@@@@MAX,MIN,EU,FIRST&LASTYEARS@@@@@@@@");
                $log.debug(d);
                /*initialize values*/
                var current = d.datum.atoms.value.value; // current value
                var country = d.datum.atoms.series.value; // current country
                var year = d.datum.atoms.category.value; // current year

                var all = d.datum.owner._datums; // dataresult

                /* auxiliar variables */
                var next = undefined; // go over list of values
                var nextCountry = undefined; // go over list of countries
                var nextYear = undefined; // go over list of years

                /* triggers */
                var isMax = true;
                var isMin = true;
                var isLast = true;
                var isFirst = true;

                all.forEach(function (a, b, c) {
                        /* update auxiliar values */
                        nextCountry = a.atoms.series.value; // country
                        nextYear = a.atoms.category.value; // year
                        next = a.atoms.value.rawValue; // value

                        /* verify first and last year */
                        if (nextYear < year) {
                            isFirst = false;
                        }
                        if (nextYear > year) {
                            isLast = false;
                        }

                        if (current > next && nextCountry != 'EU' && year == nextYear) {
                            isMin = false;
                        }
                        if (current < next && nextCountry != 'EU' && year == nextYear) {
                            isMax = false;
                        }
                    }
                );

                return (country === 'EU' || isMax || isMin) && (isLast || isFirst);
            },
            labelTextAlign: function(d){
                if(d.dataIndex == 0)
                    return 'right'
                else
                    return 'left'
            }
        };

        /**
         * @ngdoc method
         * @name ng.controller:ApproachesController#fixEnlargeColorMap1
         * @methodOf all-ages.policies.controller:ApproachesController
         * @description
         * Color map group for the enlarge state - group 1
         */
        $scope.fixEnlargeColorMap1 = function () {
            // var color = dvtUtils.getGroupColor(group);
            var dashboard = this.dashboard;
            var color = dashboard.getParameterValue("color1");
            var colorEU = dashboard.getParameterValue("pEUColor");
            var europe = dashboard.getParameterValue("pEurope");
            var component = this;
            component.chartDefinition.colors = [color];
            component.chartDefinition.colorMap[europe] = colorEU;
        };

        /**
         * @ngdoc method
         * @name ng.controller:ApproachesController#fixEnlargeColorMap2
         * @methodOf all-ages.policies.controller:ApproachesController
         * @description
         * Color map group for the enlarge state - group 2
         */
        $scope.fixEnlargeColorMap2 = function () {
            var dashboard = this.dashboard;
            // var color = dvtUtils.getGroupColor(group);
            var color = dashboard.getParameterValue("color2");
            var colorEU = dashboard.getParameterValue("pEUColor");
            var europe = dashboard.getParameterValue("pEurope");
            var component = this;
            component.chartDefinition.colors = [color];
            component.chartDefinition.colorMap[europe] = colorEU;
        };

        /**
         * @ngdoc method
         * @name ng.controller:ApproachesController#fixEnlargeColorMap3
         * @methodOf all-ages.policies.controller:ApproachesController
         * @description
         * Color map group for the enlarge state - group 3
         */
        $scope.fixEnlargeColorMap3 = function () {
            var dashboard = this.dashboard;
            // var color = dvtUtils.getGroupColor(group);
            var color = dashboard.getParameterValue("color3");
            var colorEU = dashboard.getParameterValue("pEUColor");
            var europe = dashboard.getParameterValue("pEurope");
            var component = this;
            component.chartDefinition.colors = [color];
            component.chartDefinition.colorMap[europe] = colorEU;
        };

        /**
         * @ngdoc method
         * @name ng.controller:ApproachesController#fixEnlargeColorMap4
         * @methodOf all-ages.policies.controller:ApproachesController
         * @description
         * Color map group for the enlarge state - group 4
         */
        $scope.fixEnlargeColorMap4 = function () {
            var dashboard = this.dashboard;
            // var color = dvtUtils.getGroupColor(group);
            var color = dashboard.getParameterValue("color4");
            var colorEU = dashboard.getParameterValue("pEUColor");
            var europe = dashboard.getParameterValue("pEurope");
            var component = this;
            component.chartDefinition.colors = [color];
            component.chartDefinition.colorMap[europe] = colorEU;
        };

        /* ACTIVE TAB LOGIC*/
        var state = $state.current.name;
        switch (state) {
            case 'approaches-enlarge':
                $scope.enlargeTabActive = "active";
                $scope.enlargeActive = "active in";
                $scope.indicatorsTabActive = "";
                $scope.indicatorsActive = "";
                $scope.referralTabActive = "";
                $scope.referralActive = "";
                break;
            case 'approaches-referral-iniciatives':
                $scope.enlargeTabActive = "";
                $scope.enlargeActive = "";
                $scope.indicatorsTabActive = "";
                $scope.indicatorsActive = "";
                $scope.referralTabActive = "active";
                $scope.referralActive = "active in";
                break;
            case 'approaches-indicators':
                $scope.enlargeTabActive = "";
                $scope.enlargeActive = "";
                $scope.indicatorsTabActive = "active";
                $scope.indicatorsActive = "active in";
                $scope.referralTabActive = "";
                $scope.referralActive = "";
                break;
            default:
        }

        $scope.gotoTab2=function() {
            var altura=0;
            angular.element('#containerMenu').addClass("overflowed");
            var altura = angular.element('#containerMenu').height()+angular.element('#indicators-content').height();
            angular.element('#containerMenu').removeClass("overflowed");
            setTimeout(function () {
                var section= angular.element("#approaches-map-tabs");
                $document.scrollToElementAnimated(section, altura, 500);
            },300);
        }

        $scope.$on('loaded', function(event, data) {
            if ($state.current.name == 'approaches-enlarge') {
                $document.scrollTo(0, 0, 500);
                angular.element('#containerMenu').addClass("overflowed");
                setTimeout(function () {
                    var altura = angular.element('#containerMenu').height()+angular.element('h1.page-header').height()+angular.element('.intro-text').height()+angular.element('#indicators-content').height()+angular.element('.back').height()+2;
                    angular.element('#containerMenu').removeClass("overflowed");
                    var top = angular.element('#enlarge').offset().top - altura;
                    $document.scrollTo(0, top, 500);
                }, 3000);

            } else if ($state.current.name == 'approaches-referral-iniciatives') {
                $document.scrollTo(0, 0, 500);
                angular.element('#containerMenu').addClass("overflowed");
                setTimeout(function () {
                    var altura = angular.element('#containerMenu').height()+angular.element('h1.page-header').height()+angular.element('.intro-text').height()+angular.element('#indicators-content').height()+20;
                    angular.element('#containerMenu').removeClass("overflowed");
                    var top = angular.element('#approaches-map-tabs').offset().top - altura;
                    $document.scrollTo(0, top, 500);
                }, 3000);

            } else {
                var positionScroll = $cookies.get('scrollTop');
                if(positionScroll!=undefined && positionScroll!='undefined') {
                    setTimeout(function () {
                        $document.scrollTo(0, positionScroll, 500);
                        $cookies.remove('scrollTop');
                        $cookies.put('scrollTop', 0);
                    }, 3000);
                }
            }

        });

        if ($state.current.name == 'approaches-enlarge') {
            $scope.notifiable = true;
        } else if ($state.current.name == 'approaches-referral-iniciatives') {
            $scope.notifiable = false;
        } else {
            $scope.notifiable = false;
        }
    }

    controller.$inject = ['$scope', '$stateParams', '$state', '$log', 'configService', 'dataService', 'mapProvider', 'dvtUtils', 'approachService', '$document','$window','$cookies'];
    return controller;
});
