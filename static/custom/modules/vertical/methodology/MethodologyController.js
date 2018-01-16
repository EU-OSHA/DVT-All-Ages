/**
 * @ngdoc controller
 * @name all-ages.methodology.controller:MethodologyController
 * @requires $scope
 * @requires $stateParams
 * @requires $state
 * @requires $document
 * @description
 * ############################################
 */
define(function (require) {
    'use strict';

    function controller ($scope, $stateParams, $state, $document,$window) {
        var time=Date.now();
        $scope.init = function () {

            setTimeout(function() {
                scrollGo();
            },100);
            setTimeout(function() {
                scrollCorrige();
            },150);

            angular.element($window).bind('resize', function(){
                var ahora=Date.now();
                if (ahora-time>5000) { //esto es para evitar múltiples llamadas a la fn si se hace resize a saco
                    $scope.init();
                    time=Date.now();
                }
            });
        };

        var scrollGo= function () {
            var url=window.location.href;
            var ultPosition=url.lastIndexOf("/")+1;
            var anchor ="#"+ url.substr(ultPosition, url.length)+"_anchor";

            if(angular.element(anchor).length>0) {
                var top = angular.element(anchor).position().top;
                if(anchor=="#home_anchor") {
                   $document.scrollTo(0, 0, 0);
                } else {
                    $document.scrollTo(0, top, 0);
                }
            }
        };
        var scrollCorrige= function () {
            var url=window.location.href;
            var ultPosition=url.lastIndexOf("/")+1;
            var anchor = "#"+ url.substr(ultPosition, url.length)+"_anchor";
            if(angular.element(anchor).length>0) {
                var altura=angular.element("#containerMenu").height()+10;
                var top = angular.element(anchor).position().top-altura;
                 if(anchor=="#home_anchor") {
                       $document.scrollTo(0, 0, 0);
                 } else {
                        $document.scrollTo(0, top, 0);
                 }
            }
        };


    }

    controller.$inject = ['$scope', '$stateParams', '$state', '$document','$window'];
    return controller;
});
