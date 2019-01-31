/**
 * @ngdoc controller
 * @name dvt.cookies.controller:CookiesController
 * @requires configService
 * @requires $scope
 * @requires $log
 * @description
 * Cookies Controller
 */
define(function (require) {
    'use strict';

    return {
        generateController: function (module, ctrlName) {
            return angular.module(module)
                .controller(ctrlName, function ($scope, $rootScope, $log, $window, $cookies, configService) {
                    var cookieLife= new Date();
                    cookieLife.setDate(cookieLife.getDate() + 360);
                    var cookieName = "disclaimerCookie";
                    if(window.screen.width<1024 && !$cookies.get(cookieName)){
                        if ($rootScope.hasAgreedCookies)
                        {
                            $cookies.put(cookieName,true,{expires:cookieLife});    
                        } 
                        $scope.showwidthdisclaimer= true;
                    }else {
                        $scope.showwidthdisclaimer = false;
                        if ($rootScope.hasAgreedCookies)
                        {
                            $cookies.put(cookieName,false,{expires:cookieLife});    
                        }                        
                        if (angular.element('body').hasClass('hasCookies')) {
                            angular.element('body').removeClass('hasCookies');
                        }
                    }

                    $rootScope.hasAgreedCookies = false;
                    $rootScope.declinedCookies = false;

                    $scope.widthAgree= function () {

                        $scope.showwidthdisclaimer=false;
                        if ($rootScope.hasAgreedCookies)
                        {
                            $cookies.put(cookieName,false,{expires:cookieLife});    
                        }                        
                    }
                    $scope.consentAgree = function() 
                    {
                        $rootScope.hasAgreedCookies = true;
                        configService.tooglePiwik(false);
                        if (angular.element('body').hasClass('hasCookies')) 
                        {
                            angular.element('body').removeClass('hasCookies');                            
                        }
                    }
                    $scope.cookiesDecline = function()
                    {
                        $rootScope.declinedCookies = true;
                        configService.tooglePiwik(true);
                        if (angular.element('body').hasClass('hasCookies')) 
                        {
                            angular.element('body').removeClass('hasCookies');                            
                        }
                    }
                    $scope.hasDeclined = function()
                    {
                        return $rootScope.declinedCookies;
                    } 


                });

        }
    };
});