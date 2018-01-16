/**
 * @ngdoc overview
 * @name dvt.charting
 * @requires configModule
 *
 * @description
 *   Authors
 *   ========
 *   Data Visualization Tool (DVT) for EU-OSHA
 *  2016 by Zylk.net + Bilbomatica
 *
 *
 *
 */
define(function (require) {
    'use strict';

    var angular = require('common-ui/angular'),
        configModule = require('horizontal/config/config-module');

    var module = angular.module('charting', [configModule.name]);

    module.directive('zylkBarChart', require('dvt/directives/barchart'));
    module.directive('zylkPyramidChart', require('dvt/directives/pyramidchart'));
    module.directive('zylkRadarChart', require('dvt/directives/radar'));
    module.directive('zylkMap',require('dvt/directives/map'));

    return module;
});
