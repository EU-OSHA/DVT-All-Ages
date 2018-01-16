/**
 * @ngdoc overview
 * @name dvt
 * @requires configModule
 * @requires duScroll
 * @requires angulartics
 * @requires angulartics.piwik
 *
 * @description
 *
 */
define(function (require) {
  'use strict';

    var angular = require('common-ui/angular'),
        configModule = require('horizontal/config/config-module'),
        MaximizeController = require('dvt/graphic/MaximizeController'),
        HistoricalController = require('dvt/graphic/HistoricalController'),
        CookiesController = require('dvt/cookies-disclaimer/CookiesController'),
        TranslateController = require('dvt/translate/TranslateController');

    require('dvt/directives/scroll');
    require('common-ui/angular-bootstrap-affix');
    require('dvt/angulartics');
    require('dvt/angulartics-piwik');
    require('dvt/directives/tooltip');
    require('dvt/directives/angular-cookies');
    require('dvt/directives/angular-consent');

  
    var module = angular.module('directives', [configModule.name, 'duScroll', 'angulartics', 'angulartics.piwik', 'mgcrea.bootstrap.affix', '720kb.tooltips','ngCookies','angularConsent']);
  
    //TODO refactor las directivas del framework renombrarlas a dvtNombre
    module.directive('zylkDashboard', require('dvt/directives/dashboard'));
    module.directive('zylkSelect', require('dvt/directives/select'));
    module.directive('zylkRadio', require('dvt/directives/radio'));
    module.directive('zylkSocial', require('dvt/directives/social'));
    module.directive('zylkMainMenu', require('dvt/directives/main-menu'));
    module.directive('zylkFooter', require('dvt/directives/footer'));
    module.directive('dvtSearch', require('dvt/directives/search'));

    CookiesController.generateController('directives', 'CookiesController');
    MaximizeController.generateController('directives', 'MaximizeController');
    HistoricalController.generateController('directives', 'HistoricalController');
    TranslateController.generateController('directives', 'TranslateController');

    module.filter('pagination', function() {
      return function(input, start) {

        start = +start; //parse to int

        //console.log("start: " + start);
        //console.log("input in pretty-print mode: \n" + JSON.stringify(input, undefined, 2));

        if (start != undefined && input != undefined) {
          input = input.slice(start);
        }
        return input;
      }
    });

    return module;
});
