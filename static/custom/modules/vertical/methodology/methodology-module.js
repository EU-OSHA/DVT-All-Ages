define(function (require) {
    'use strict';

    var angular = require('common-ui/angular'),
        configModule = require('horizontal/config/config-module'),
        directivesModule = require('horizontal/directives/directives-module');

    /**
     * @ngdoc overview
     * @name all-ages.methodology
     * @requires ui.router
     * @requires configModule
     */
    var module = angular.module('methodology', ['ui.router', configModule.name]);

    module.config(function ($stateProvider, configService, $controllerProvider,$urlRouterProvider) {

        $urlRouterProvider.when('/about-tool', 'about-tool/home');
        $stateProvider.state('methodology', {
            url: "/about-tool/:anchor",
            params: {
                anchor: {
                    value: "home",
                    squash: "home"
                }
            },
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("methodology", "methodology"),
                    controller: 'MethodologyController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/methodology/MethodologyController', 'methodology', 'MethodologyController')
                }
            }
        });
    });

    return module;
});
