define(function (require) {
    'use strict';

    var angular = require('common-ui/angular'),
        configModule = require('horizontal/config/config-module');

    /**
     * @ngdoc overview
     * @name all-ages.policies
     * @requires ui.router
     * @requires configModule
     */
    var module = angular.module('policies', ['ui.router', configModule.name]);
    module.config(function ($stateProvider, configService, $controllerProvider, $urlRouterProvider) {

        // TODO refact not to require this to be done explicitly
        $urlRouterProvider.when('/country-groups', 'country-groups/group1/description');
        $urlRouterProvider.when('/country-groups/:pGroup', 'country-groups/:pGroup/description');
        
        $stateProvider.state('approaches-indicators', {
            url: "/country-groups/:pGroup/description",
            params: {
                pGroup: {
                    value: "group1",
                    squash: "group1"
                }
            },
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("policies/approaches", "approaches-map"),
                    controller: 'ApproachesController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/approaches/ApproachesController', 'approaches', 'ApproachesController')
                }
            }
        });

        $stateProvider.state('approaches-referral-iniciatives', {
            url: "/country-groups/:pGroup/policies-iniciatives",
            params: {
                pGroup: {
                    value: "group1",
                    squash: "group1"
                }
            },
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("policies/approaches", "approaches-map"),
                    controller: 'ApproachesController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/approaches/ApproachesController', 'approaches', 'ApproachesController')
                }
            }
        });

        $stateProvider.state('approaches-enlarge', {
            url: "/country-groups/:pGroup/group-comparison/:indicator",
            params: {
                pGroup: {
                    value: "group1",
                    squash: "group1"
                },
                indicator: {
                    value: "median-age-time-series",
                    squash: "median-age-time-series"
                }
            },
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("policies/approaches", "approaches-map"),
                    controller: 'ApproachesController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/approaches/ApproachesController', 'approaches', 'ApproachesController')
                }
            }
        });

        $stateProvider.state('policy', {
            url: "/policies-strategies-programmes/:policy",
            params: {
                policy: {
                    value: "",
                    squash: true
                }
            },
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("policies/policy", "policy"),
                    controller: 'PolicyController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/policy/PolicyController', 'policies', 'PolicyController')
                }
            }
        });

        $stateProvider.state('all-country-policies', {
            url: "/policies-strategies-programmes/all/:country",
            params: {
                country: {
                    value: "",
                    squash: true
                }
            },
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("policies/policy", "policy"),
                    controller: 'PolicyController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/policy/PolicyController', 'policies', 'PolicyController')
                }
            }
        });
    });

    module.filter('startFrom', function() {
        return function (input, start) {
            start = +start; //parse to int
            if (start !== undefined && input !== undefined) {
                input = input.slice(start);
            }
            return input;
        };
    });

    module.directive('zkApproachEnlarge', require('vertical/approaches/ZkMainIndicatorDirective'));
    module.factory('approachService', require('vertical/services/approachService'));
    return module;
});
