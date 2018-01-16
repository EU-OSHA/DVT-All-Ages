define(function (require) {
    'use strict';

    var angular = require('common-ui/angular'),
        configModule = require('horizontal/config/config-module');

    /**
     * @ngdoc overview
     * @name all-ages.countries
     * @requires ui.router
     * @requires configModule
     * @requires duScroll
     */
    var module = angular.module('countries', ['ui.router', configModule.name, 'duScroll']);

    /** List of states of the  module */
    module.config(function ($stateProvider, configService, $controllerProvider,$urlRouterProvider) {

        $urlRouterProvider.when('/country-card', 'country-profiles');
        $urlRouterProvider.when('/country-comparison', 'country-profiles');

        $stateProvider.state('country-profiles', {
            url: "/country-profiles",
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("countries/csp", "countries-selection-panel"),
                    controller: 'CSPController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/countries/CSPController', 'countries', 'CSPController')
                }
            }
        })
        .state('country-card', {
            url: "/country-card/:pCountry1/:anchor",
            params: {
                pCountry1: {
                    value: "RO",
                    squash: "RO"
                },
                anchor: {
                    value: null,
                    squash: true
                }
            },
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("countries/country-insight/country-card", "country-insight"),
                    controller: 'CountriesController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/countries/CountriesController', 'countries', 'CountriesController')
                }
            }
        })

        .state('country-comparison', {
            url: "/country-comparison/:pCountry1/:pCountry2/:anchor",
            params : {
                pCountry1: {
                    value: "RO",
                    squash: "RO"
                },
                pCountry2: {
                    value: "RO",
                    squash: "RO"
                },
                anchor: {
                    value: null,
                    squash: true
                }
            },
            //css: configService.getVerticalStylePath("countries", "country-comparison"),
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("countries/country-insight/country-comparison", "country-comparison"),
                    controller: 'CountriesController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/countries/CountriesController', 'countries', 'CountriesController')
                }
            }
        })

        .state('infographics', {
            url: "/infographics",
            params : { },
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("countries/additional-resources", "additional-resources"),
                    controller: 'AdditionalResourcesController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/countries/AdditionalResourcesController', 'countries', 'AdditionalResourcesController')
                }
            }
        });


    });

    module.factory('countriesService', require('vertical/services/countriesService'));

    /* CSP */
    module.directive('zylkCountryCspPanel', require('vertical/countries/directives/panel'));
    /* Country card - Country comparison */
    module.directive('zylkCountryAnchor', require('vertical/countries/directives/anchor'));
    module.directive('zylkCountryMenu', require('vertical/countries/directives/menu'));
    module.directive('zylkSection', require('vertical/countries/directives/section'));
    module.directive('zylkSelectRedirect', require('vertical/countries/directives/select-redirect'));

    return module;

});
