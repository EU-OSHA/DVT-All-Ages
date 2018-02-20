/**
 * @ngdoc directive
 * @name dvt.directive:ZylkMainMenu
 * @scope
 * @restrict E
 *
 * @description
 * A description of the directive
 *
 */
function zoomSmall(){
    angular.element('html').css('font-size','8px');
}
function zoomMedium(){
    angular.element('html').css('font-size','10px');
}
function zoomBig(){
    angular.element('html').css('font-size','12px');
}

define(function (require) {
    'use strict';

    var sequence = 1;
    var configService = require('horizontal/config/configService');

    function nextId() {
        return sequence++;
    }



    function ZylkMenuDirective($location, $log) {
        //TODO get data from ajax in JSON files
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {},
            controller: ['$rootScope', '$scope', '$state', 'configService', '$http', '$log','dataService',
                function ($rootScope, $scope, $state, configService, $http, $log, dataService) {

                    /*gtranslator info*/
                    var gtranslatorinfo = $(".gtranslator-info");
                    var gtranslatorinfo = gtranslatorinfo.offset();

                    $(document).click(function(e) {
                        if(!$(e.target).closest('#gTranslate-modal').length && !$(e.target).is($('#gTranslate-modal-link'))) {
                            if (!$(e.target).is($('span.gtranslator-info'))) {
                                $("#gTranslate-modal").fadeOut('fast');
                            }
                        }
                    });
                    
                    $(".gtranslator-info").mouseover(function(){
                        $("#gTranslate-modal").fadeIn('fast');
                    });
                    $("#gTranslate-modal").mouseleave(function(){
                        $("#gTranslate-modal").fadeOut('fast');
                    });
                    /*end gtranslator*/


                    //hide print icon in mobile
                    if(configService.isMobile()) {
                        angular.element(".a2a_button_print").remove();
                    }

                    var breadCrumbStructure = require('json!dvt/directives/breadcrumb-items');
                    var titleStructure = require('json!dvt/directives/title-items');

                    /*gtranslator info*/
                    var gtranslatorinfo = $(".gtranslator-info");
                    var gtranslatorinfo = gtranslatorinfo.offset();

                    $(document).click(function(e) {
                        if(!$(e.target).closest('#gTranslate-modal').length && !$(e.target).is($('#gTranslate-modal-link'))) {
                            if (!$(e.target).is($('span.gtranslator-info'))) {
                                $("#gTranslate-modal").fadeOut('fast');
                            }
                        }
                    });
                    
                    $(".gtranslator-info").mouseover(function(){
                        $("#gTranslate-modal").fadeIn('fast');
                    });
                    $("#gTranslate-modal").mouseleave(function(){
                        $("#gTranslate-modal").fadeOut('fast');
                    });
                    /*end gtranslator*/

                    // get menu.json for structure
                    var path = configService.getHorizontalDirectiveDataPath("main-menu", "menu");
                    $http.get(path, { data: "", headers: {"Content-Type": "application/json"}}).success(function (menuStructure) {
                        $log.debug('menu structure fetched');
                        $scope.structure = menuStructure;
                    });

                    $scope.isCurrentStateMenu = function (path) {
                        var lPath = $location.path().split("/");
                        $log.debug("isCurrentStateMenu and menu variable  |  path: " + path + "  |  " + "lPath[1]: " + lPath[1]);
                        var isCurrent = (path === lPath[1]
                            || (lPath[1] == "" && path == "home")
                            || (lPath[1] == "site-map" && path == "home")
                            || (lPath[1] == "accessibility" && path == "home")
                            || (lPath[1] == "privacy-policy" && path == "home")
                            || (lPath[1] == "legal-notice" && path == "home"));

                        if (isCurrent){
                            $log.info("isCurrentStateMenu: " + path);
                        }
                        return isCurrent?'main-menu-selected' : '';
                        //return (path === lPath[1] || (lPath[1] == "" && path == "home")) ? 'main-menu-selected' : '';
                    };


                    $scope.isCurrentSection = function (id) {
                        var lPath = $location.path().split("/");
                        $log.debug("isCurrentSection and menu variable  |  " + id.replace(/\s+/g, '-') + "  |  " + breadCrumbStructure['sections'][lPath[1]]);
                        $scope.pathURLDVT=$location.absUrl();
                        $scope.pathURLDVTGoogle = "https://plus.google.com/share?url=" + $scope.pathURLDVT;
                        var isCurrent = (id.replace(/\s+/g, '-') === breadCrumbStructure['sections'][lPath[1]] );
                        if (isCurrent){
                            $log.info("isCurrentSection | section: '" + lPath[1] + "' under menu option: '" + id) + "'";
                        }
                        return isCurrent ? 'main-menu-selected' : '';
                    };



                    $scope.goToMethodology = function () {
                        $state.go('methodology', {'#': $state.href($state.current.name, {}, {absolute: false}).split("/")[1]});
                    };

                    $scope.hideLinkMethodology = function () {
                        if ($state.href($state.current.name, {}, {absolute: false}) !== null) {
                            var pathStart = $state.href($state.current.name, {}, {absolute: false}).split("/")[1];
                            return (['about-tool', 'legal-notice', 'accessibility', 'privacy-policy', 'site-map', 'newNonSenseState'].indexOf(pathStart) !== -1) ? 'hidden' : '';
                        }
                        return "";
                    };

                    $scope.titleS=titleStructure;
                    $scope.pathURLDVT=$location.absUrl();
                    $scope.pathURLDVTGoogle = "https://plus.google.com/share?url=" + $scope.pathURLDVT.replace("#","?_escaped_fragment_=");

                    $rootScope.$on('$viewContentLoaded', function(event, viewConfig) {
                            $log.debug('------------------------------------------------------');
                            $log.info("'Loading $viewContentLoaded | current state: '" + $state.current.name + "'");
                            var path = $location.path();
                            $log.debug(path);
                            $log.warn($state.current.name);
                            var cadena = "";


                            $scope.breadCrumb = breadCrumbStructure[$state.current.name];


                            if ($state.current.name == 'home') {
                                $scope.isHome = true;
                                $scope.titleHeader = titleStructure['default-title'];
                                $scope.title = titleStructure[$state.current.name];
                            } else {
                                var pathURL = path.split("/");
                                $scope.isHome = false;
                                var setBreadCrumbs=function() {
                                    $scope.breadCrumb = breadCrumbStructure[$state.current.name];
                                    $scope.title = titleStructure[$state.current.name];
                                    $scope.isHome = false;
                                    $scope.anchorPath = $location.path().split("/")[1];
                                };

                                var setTitleHeaderHTML=function() {
                                    if($scope.breadCrumb.indexOf(" >> ")!=-1) {
                                        var trozos = $scope.breadCrumb.split(" >> ");
                                        for (var i = trozos.length - 1; i > -1; i--) {
                                            cadena += trozos[i] + " - ";
                                        }
                                        cadena = cadena.replace(/<[^>]*>?/g, '');
                                    }
                                    $scope.titleHeader = cadena + titleStructure['pages-title'];
                                };

                                dataService.structureCountries.then(function(dataset){
                                    var country = dataService.dataMapper(dataset).filter(function(item) {
                                        return item.Id == pathURL[2]
                                    })[0];

                                    if($state.current.name=='country-card') {
                                        $scope.breadCrumb+="<span>"+ country.Description + "</span>";
                                        $scope.title= country.Description;
                                        setTitleHeaderHTML();
                                    } else if ($state.current.name=='country-comparison') {
                                        var country2 = dataService.dataMapper(dataset).filter(function(item) {
                                            return item.Id == pathURL[3]
                                        })[0];

                                        $scope.breadCrumb+="<span>" + country.Description + " - " + country2.Description + "</span>";
                                        $scope.title= country.Description + " - " + country2.Description;
                                        setTitleHeaderHTML();
                                    } else {
                                        setBreadCrumbs();
                                        setTitleHeaderHTML();
                                    }
                                });

                            }

                            if(collapse.hasClass( "indvt" ) == true) {
                                collapse.removeClass("indvt");
                                collapse.removeClass("in");
                            }

                            //lo pongo en el title
                            angular.element("title").html($scope.titleHeader);

                        }, $scope);


                    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {

                        $state.go('404', {});
                        console.warn("$stateChangeError: ");
                        console.warn("unfoundState.to: " + unfoundState.to);
                        console.warn("unfoundState.to: " + unfoundState.to);
                        console.warn("unfoundState.options: " + unfoundState.options );
                    });

                    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {

                        $state.go('404', {});
                        console.warn("$stateChangeError: ");
                        console.warn("unfoundState.to: " + unfoundState.to);
                        console.warn("unfoundState.to: " + unfoundState.to);
                        console.warn("unfoundState.options: " + unfoundState.options );
                    });


                    // la clase intdvt es nuestra y sustituye a la de bootstrap.
                    // la clase in de bootstrap siempre la quitamos, no nos interesa

                    var toggle = angular.element( "button.navbar-toggle" );
                    var collapse = angular.element("#osha-menu-collapse");


                    toggle.click(function() {
                        if(collapse.hasClass( "indvt" ) == true){
                            collapse.removeClass("indvt");
                            $log.debug('cerrado');
                            collapse.removeClass("in");
                        }else{
                            collapse.addClass("indvt");
                            $log.debug('abierto');
                            collapse.removeClass("in");
                        }
                    });

                    // Trigger drop-up menu when you click on the burger buttton
                    angular.element( "#osha-menu-collapse .dropdown-menu a" ).click(function() {
                        collapse.removeClass("indvt");
                        collapse.removeClass("in");
                    });

            }],
            templateUrl: configService.getHorizontalDirectiveTplPath("main-menu", "menu")
        }
    }

    ZylkMenuDirective.$inject = ['$location', '$log'];

    return ZylkMenuDirective;
});
