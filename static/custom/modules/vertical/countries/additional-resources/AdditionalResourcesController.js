/**
 * @ngdoc controller
 * @name all-ages.countries.controller:AdditionalResourcesController
 * @requires $scope
 * @requires $stateParams
 * @requires $state
 * @requires $document
 * @description
 * ############################################
 */
define(function (require) {
  'use strict';

  function controller($scope, $stateParams, $state, configService, $log, $document) {
    /* data wrangling parameters*/

    var i18n = require('json!vertical/additional-resources/AR-i18n');
    $scope.i18n = i18n;

    //Variables pagination
    $scope.currentPage = 0;
    $scope.pageSize = 12;
    $scope.pageElem = 13;
    $scope.data = [];
    $scope.elementsStart=1;
    $scope.elementsEnd=$scope.pageSize;

    $scope.itemTemplate = configService.getVerticalTplPath("countries/additional-resources", "resources-item");
    $scope.firstItemTemplate = configService.getVerticalTplPath("countries/additional-resources", "resources-first-item");

    /**
     * @ngdoc method
     * @name ng.controller:AdditionalResourcesController#numberOfPages
     * @methodOf all-ages.countries.controller:AdditionalResourcesController
     * @description
     * My Description rules
     */
    $scope.numberOfPages = function () {
      return Math.ceil($scope.i18n.pagination.items.length / $scope.pageSize);
    };

    /**
     * @ngdoc method
     * @name ng.controller:AdditionalResourcesController#firstPage
     * @methodOf all-ages.countries.controller:AdditionalResourcesController
     * @description
     * My Description rules
     */
    $scope.firstPage = function () {
      $scope.currentPage = 0;
      $scope.pageElem = 13;
      $scope.elementsStart=1;
      $scope.pageStart = 0;
      $scope.elementsEnd=$scope.pageSize;$scope.pagestart = 13;

      if($scope.elementsEnd>$scope.i18n.pagination.items.length) {
        $scope.elementsEnd=$scope.i18n.pagination.items.length;
      }
    };

    /**
     * @ngdoc method
     * @name ng.controller:AdditionalResourcesController#previousPage
     * @methodOf all-ages.countries.controller:AdditionalResourcesController
     * @description
     * My Description rules
     */
    $scope.previousPage = function () {
      if ($scope.currentPage > 1) {
        $scope.pageElem = 12;
        $scope.currentPage--;
        $scope.elementsStart=$scope.currentPage * $scope.pageSize +1;
        $scope.elementsEnd= $scope.elementsStart + $scope.pageSize;
        $scope.pageStart = $scope.elementsStart;
      } else {
        $scope.pageElem = 13;
        $scope.elementsStart=1;
        $scope.pageStart = 0;
        $scope.elementsEnd=$scope.pageSize;
      }
      if($scope.elementsEnd>$scope.i18n.pagination.items.length) {
        $scope.elementsEnd=$scope.i18n.pagination.items.length;
      }
    };

    /**
     * @ngdoc method
     * @name ng.controller:AdditionalResourcesController#nextPage
     * @methodOf all-ages.countries.controller:AdditionalResourcesController
     * @description
     * My Description rules
     */
    $scope.nextPage = function () {
      if ($scope.currentPage < $scope.i18n.pagination.items.length / $scope.pageSize - 1) {
        $scope.currentPage++;
          $scope.pageElem = 12;
        $scope.elementsStart=$scope.currentPage * $scope.pageSize +1 ;
        if($scope.elementsStart + $scope.pageSize<=$scope.i18n.pagination.items.length) {
          $scope.elementsEnd = $scope.elementsStart + $scope.pageSize;
        } else {
          $scope.elementsEnd=$scope.i18n.pagination.items.length;
        }

        if($scope.elementsEnd>$scope.i18n.pagination.items.length) {
          $scope.elementsEnd=$scope.i18n.pagination.items.length;
        }
          $scope.pageStart = $scope.elementsStart;

      }
    };

    /**
     * @ngdoc method
     * @name ng.controller:AdditionalResourcesController#lastPage
     * @methodOf all-ages.countries.controller:AdditionalResourcesController
     * @description
     * My Description rules
     */
    $scope.lastPage = function () {
      var resto= Math.floor($scope.i18n.pagination.items.length / $scope.pageSize);
      $scope.currentPage=resto;
        $scope.pageElem = 12;
      $scope.elementsStart=$scope.currentPage * $scope.pageSize +1;
      if($scope.elementsStart + $scope.pageSize<=$scope.i18n.pagination.items.length) {
        $scope.elementsEnd = $scope.elementsStart + $scope.pageSize;
      } else {
        $scope.elementsEnd=$scope.i18n.pagination.items.length;
      }

      if($scope.elementsEnd>$scope.i18n.pagination.items.length) {
        $scope.elementsEnd=$scope.i18n.pagination.items.length;
      }

      //$scope.paginationText= $scope.i18n.Displaying + " " + $scope.elementsStart + "-" + $scope.elementsEnd + " " + $scope.i18n.of + " " +  $scope.policies.length;
        $scope.pageStart = $scope.elementsStart;
    };

    $document.scrollTo(0, 0, 0);

  }

  controller.$inject = ['$scope', '$stateParams', '$state', 'configService', '$log', '$document'];
  return controller;
});
