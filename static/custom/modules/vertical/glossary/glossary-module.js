
define(function (require) {
    'use strict';

    var angular = require('common-ui/angular'),
        configModule = require('horizontal/config/config-module');

    /**
     * @ngdoc overview
     * @name all-ages.glossary
     * @requires ui.router
     * @requires configModule
     */
    var module = angular.module('glossary', ['ui.router', configModule.name]);
    
    module.config(function ($stateProvider, configService, $controllerProvider) {
        
        $stateProvider.state('glossary', {
            url: "/glossary",
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("glossary", "glossary"),
                    controller: 'GlossaryController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/glossary/GlossaryController', 'glossary', 'GlossaryController')
                }
            }
        })

        .state('glossary-detail', {
            url: "/glossary-detail",
            views: {
                "content-main": {
                    templateUrl: configService.getVerticalTplPath("glossary", "glossary"),
                    controller: 'GlossaryController',
                    resolve: configService.dynamicallyRegisterController($controllerProvider, 'vertical/glossary/GlossaryController', 'glossary', 'GlossaryController')
                }
            }
        });

    });

    return module;
});
