define(function (require) {
    'use strict';

    var angular = require('common-ui/angular'),
        configModule = require('horizontal/config/config-module');

    /**
     * @ngdoc overview
     * @name all-ages.issue
     * @requires ui.router
     * @requires configModule
     */
    var module = angular.module('issue', ['ui.router', configModule.name]);
    module.config(function ($stateProvider, configService, $urlRouterProvider, $controllerProvider) {


        // TODO refact not to require this to be done explicitly
        $urlRouterProvider.when('/key-issue',                               'key-issue/early-exit-labour-market/AT/EU');
        $urlRouterProvider.when('/key-issue/early-exit-labour-market',      'key-issue/early-exit-labour-market/AT/EU');
        $urlRouterProvider.when('/key-issue/labour-market-participation',   'key-issue/labour-market-participation/AT/EU');
        $urlRouterProvider.when('/key-issue/impact-work-health',            'key-issue/impact-work-health/AT/EU');
        $urlRouterProvider.when('/key-issue/health-inequalities',           'key-issue/health-inequalities/AT/EU');
        $urlRouterProvider.when('/key-issue/working-conditions',            'key-issue/working-conditions/AT/EU');

        $stateProvider.state('issue-retirementAge', {
            url: "/key-issue/early-exit-labour-market/:pCountry1/:pCountry2",
            params : {
                pCountry1: {
                    value: "AT",
                    squash: "AT"
                },
                pCountry2: {
                    value: "EU",
                    squash: "EU"
                }
            },
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("issue/partials/main-indicators", "retirement-age"),
                    controller: 'IssueController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/issue/IssueController', 'countries', 'IssueController')
                }
            }
        }),
        $stateProvider.state('issue-olderWorkersEmployment', {
            url: "/key-issue/labour-market-participation/:pCountry1/:pCountry2",
            params : {
                historical: {
                    value: false
                },
                pCountry1: {
                    value: "AT",
                    squash: "AT"
                },
                pCountry2: {
                    value: "EU",
                    squash: "EU"
                }
            },
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("issue/partials/main-indicators", "older-workers-employment"),
                    controller: 'IssueController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/issue/IssueController', 'issue', 'IssueController')
                }
            }
        }),
        $stateProvider.state('issue-challenges', {
            url: "/key-issue/impact-work-health/:pCountry1/:pCountry2",
            params : {
                pCountry1: {
                    value: "AT",
                    squash: "AT"
                },
                pCountry2: {
                    value: "EU",
                    squash: "EU"
                }
            },
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("issue/partials/main-indicators", "challenges"),
                    controller: 'IssueController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/issue/IssueController', 'issue', 'IssueController')
                }
            }
        }),
        $stateProvider.state('issue-HLYvsLE', {
            url: "/key-issue/health-inequalities/:pCountry1/:pCountry2",
            params : {
                pCountry1: {
                    value: "AT",
                    squash: "AT"
                },
                pCountry2: {
                    value: "EU",
                    squash: "EU"
                }
            },
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("issue/partials/main-indicators", "HLY-vs-LE"),
                    controller: 'IssueController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/issue/IssueController', 'issue', 'IssueController')
                }
            }
        }),
        $stateProvider.state('issue-dissatisfaction', {
            url: "/key-issue/working-conditions/:pCountry1/:pCountry2",
            params : {
                pCountry1: {
                    value: "AT",
                    squash: "AT"
                },
                pCountry2: {
                    value: "EU",
                    squash: "EU"
                }
            },
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("issue/partials/main-indicators", "dissatisfaction"),
                    controller: 'IssueController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/issue/IssueController', 'issue', 'IssueController')
                }
            }
        });
    });

    module.factory('issueService', require('vertical/issue/service'));
    module.directive('zylkMenuIssue', require('vertical/issue/ZylkMenuIssueDirective'));
    
    return module;
});
