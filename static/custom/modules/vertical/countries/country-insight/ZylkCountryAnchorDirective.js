define(function (require) {
    'use strict';

    var sequence = 1;
    var configService = require('horizontal/config/configService');

    function nextId() {
        return sequence++;
    }

    function ZylkCountryAnchorDirective($stateParams) {
        //TODO get data from ajax in JSON files
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            controller: ['$scope', '$state', '$stateParams', 'configService', 'countriesService', '$http', '$log', '$document', '$window', '$timeout', function ($scope, $state, $stateParams, configService, countriesService, $http, $log, $document, $window, $timeout) {

                if ($state.current.name == 'country-card') {
                    $scope.anchors = require('json!vertical/country-card/anchor-items')
                } else if ($state.current.name == 'country-comparison') {
                    $scope.anchors = require('json!vertical/country-comparison/anchor-items')
                }

                var veces=0;
                $scope.gotoAnchor = function(elemId, $event, correction) {
                    $log.debug(elemId);
                    
                    var section = angular.element('#' + elemId);

                    angular.element('#containerMenu').addClass("affix");
                    angular.element('#formCountryInsigth').addClass("affix");
                    
                    var fixHeight=80;

                    if ($state.current.name == 'country-card') {
                        setTimeout(function() {
                            var incrHeight=0;
                            if($(window).width()<769) {
                                incrHeight=fixHeight;
                            }
                            var altura=$("#formCountryInsigth").height()+$("#containerMenu").height()-incrHeight;
                            $document.scrollToElementAnimated(section, altura, 500);
                        },500);

                        $state.transitionTo('country-card', {
                            pCountry1: $stateParams.pCountry1,
                            anchor: elemId
                        }, {notify: false});

                    } else if ($state.current.name == 'country-comparison') {
                        setTimeout(function() {
                            var incrHeight=0;
                            if($(window).width()<769) {
                                incrHeight=fixHeight;
                            }
                            var altura=$("#formCountryInsigth").height()+$("#containerMenu").height()+($(".sectionIconAndTitle:eq(0)").height()*2)-incrHeight; //el *2 es por los margin y padding del H2
                            $document.scrollToElementAnimated(section, altura, 500);
                        },500);
                        $state.transitionTo('country-comparison', {
                            pCountry1: $stateParams.pCountry1,
                            pCountry2: $stateParams.pCountry2,
                            anchor: elemId
                        }, {notify: false});
                    }
                };

                $scope.gotoTop = function(elemId, $event, correction) {
                    $document.scrollTo(0, 0);
                };

                if($stateParams.anchor != null) {
                    $timeout(function () {
                        $log.debug("$stateParams.anchor: " + $stateParams.anchor);
                        $scope.gotoAnchor($stateParams.anchor, null, true);
                    }, countriesService.getAnchorTime[$state.current.name]);
                }
            }],
            templateUrl: configService.getVerticalDirectiveTplPath("countries/country-insight", "anchor")
        }
    }

    ZylkCountryAnchorDirective.$inject = ['$location', '$anchorScroll' ];

    return ZylkCountryAnchorDirective;
});
