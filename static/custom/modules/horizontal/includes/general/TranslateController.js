/**
 * @ngdoc controller
 * @name dvt.translate.controller:TranslateController
 * @requires configService
 * @requires $scope
 * @requires $log
 * @description
 * Translate Controller
 */
define(function (require) {
    'use strict';

    return {
        generateController: function (module, ctrlName) {
            return angular.module(module)
                .controller(ctrlName, function ($scope, $log, $window) {
                    angular.element("#google_translate_element a.goog-te-menu-value" ).on('click', function() {

                        var items =  angular.element(angular.element("iframe")[0].contentWindow.document).find("a.goog-te-menu2-item ");

                        items.on('click', function(event) {
                         var language;
                            if(event.target.tagName.toLowerCase() === "div" ) {
                                language =angular.element(event.target).find("span.text")[0].innerHTML;
                                $log.debug("Selected language to translate by google : "+ language);
                            }else{
                                language=event.target.innerHTML;
                                $log.debug("Selected language to translate by google : "+language);
                            }
                            window._paq.push(['trackEvent', 'googleTranslateMenu', 'languageTranslate', language, 11]);

                        });
                    });

                });
        }
    };
});