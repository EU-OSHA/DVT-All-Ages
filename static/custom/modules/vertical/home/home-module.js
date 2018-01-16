define(function (require) {
    'use strict';

    var angular = require('common-ui/angular'),
        configModule = require('horizontal/config/config-module');

    //require('common-ui/angularjs-slider');

    /**
     * @ngdoc overview
     * @name all-ages.home
     * @requires ui.router
     * @requires configModule
     */
    var module = angular.module('home', ['ui.router', configModule.name]);

    /* List of states of the  module */
    module.config(function ($stateProvider, configService, $urlRouterProvider, $controllerProvider) {
        
        $urlRouterProvider.when('', '/');
        $stateProvider.state('home', {
            url: "/",
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("home", "home"),
                    controller: 'HomeController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/home/HomeController', 'home', 'HomeController')
                }
            }
        });
    });

    module.directive('zylkRange', require('vertical/home/range'));
    
    return module;
});