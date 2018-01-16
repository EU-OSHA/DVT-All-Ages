/**
 * @ngdoc controller
 * @name all-ages.countries.controller:CSPController
 * @requires $scope
 * @requires $stateParams
 * @requires $state
 * @requires $document
 * @description
 * ############################################
 */
define(function (require) {
  'use strict';

  function controller($scope, $stateParams, $state, configService, $log, $http, dataService, mapProvider, dvtUtils, countriesService, plotsProvider, $document) {
    /* data wrangling parameters*/

    var i18n = require('json!vertical/csp/i18n');
    $scope.i18n = i18n;

    $scope.promises = {
      europePromise: mapProvider.getEuropeShape()
    };

    $scope.dashboard = {
      promises: $scope.promises,
      parameters: {}
    };

    /* Country label */
    dataService.getAllCountries().then(function (dataset) {
      $log.debug("####### Countries Controller getCountriesNotEU #########################");
      $log.debug(dataset.resultset);
      var countries = {};
      var countriesNew = {};
      dataset.data.resultset.forEach(function (country) {
        //countries["" + country[0]] = country[1];
        if (country[0] != "EU") {
          countries["" + country[0]] = {
            id: country[0],
            desc: country[1],
            container: {
              width: 200,
              height: 200,
              zoomH: 640,
              zoomW: 640
            }
          };
        }
      });
      $scope.countries = countries;
      $log.debug($scope.countries);

    }).catch(function (err) {
          $log.warn("getAllCountries data request fail!");
    });

    /* EU metadata */
    $scope.europe = {
      name: 'Europe',
      id: "EU"
    };
  }

  controller.$inject = ['$scope', '$stateParams', '$state', 'configService', '$log', '$http', 'dataService', 'mapProvider', 'dvtUtils', 'countriesService', 'plotsProvider', '$document'];
  return controller;
});
