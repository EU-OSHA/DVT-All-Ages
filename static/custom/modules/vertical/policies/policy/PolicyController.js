/**
 * @ngdoc controller
 * @name all-ages.policies.controller:PolicyController
 * @requires $scope
 * @requires $stateParams
 * @requires $state
 * @requires dataService
 * @requires mapProvider
 * @requires $log
 * @requires configService
 * @requires $document
 * @requires $compile
 * @description
 * ############################################
 */
define(function (require) {
    'use strict';
    
    function controller($scope, $stateParams, $state, dataService, mapProvider, $log,configService, $document, $compile) {

        // BINDDING VARIABLES START ------------------------------------------------------------------------
        $scope.isCollapsed = false;
        $scope.countries = [];
        $scope.classifications = [];
        $scope.policies = [];
        $scope.searchParams = {
            countries: [],
            policies: [],
            classifications: []
        };
        $scope.seeAllCountryPolicy = false;


        //Variables pagintation
        $scope.currentPage = 0;
        $scope.pageSize = 10;
        $scope.data = [];
        $scope.elementsStart = 1;
        $scope.elementsEnd = $scope.pageSize;


        // BINDDING VARIABLES END --------------------------------------------------------------------------

        var i18n = require('json!vertical/policy/i18n');
        $scope.i18n = i18n;


        // MAP PROMISES STRUCTURE & PROMISE FOR SHAPES START -----------------------------------------------
        $scope.promises = {};
        $scope.promises.mapPromise = mapProvider.getEuropeShape();

        $scope.dashboard = {
            promises: $scope.promises
        };


        var seeMoreLimpiar=function() {
            if(angular.element('.policy-items').length>0) {
                angular.element('.seemore').hide();
                angular.element('.policy-items').each(function (x) {
                    angular.element(this).find("#long-description-"+x).removeClass("policy-description");
                    var alturaContainer = angular.element(this).find("#long-description-"+x).height();
                    if(alturaContainer>90) {
                      angular.element(this).find("#long-description-"+x).addClass("policy-description");
                      angular.element('.seemore:eq('+x+')').show();
                    }
                });

            }
        };

        // MAP PROMISES STRUCTURE & PROMISE FOR SHAPES END -------------------------------------------------

        // CHECKBOX FILTERS START --------------------------------------------------------------------------
        dataService.getAllCountries().then(function (data) {
            $log.debug('getCountries');
            $log.debug(data);

            data.data.resultset.map(function (elem) {
                if (elem[0] !== "EU") {
                    var param = (!!$stateParams.country) ? $stateParams.country : undefined;
                    $scope.countries.push({
                        key: elem[0],
                        name: elem[1],
                        param: param
                    });
                }
            });

            if (!!$stateParams.country && $stateParams.country !== "") {
                angular.element('#country-filter-' + $stateParams.country).checked = true;
            }

            $log.debug($scope.countries);
        }).catch(function (err) {
            throw err;
        });

        dataService.getPLClassificationFilter().then(function (data) {
            $log.debug('getPLClassificationFilter');
            $log.debug(data);

            for (var classification in data['data']['resultset']) {
                var valor=data['data']['resultset'][classification][0];
                if(valor=='OSH') {
                    valor=$scope.i18n.OSHText;
                }
                if(valor=='RTW') {
                    valor=$scope.i18n.RTWText;
                }

                $scope.classifications.push(valor);
            }
        }).catch(function (err) {
            throw err;
        });
        // CHECKBOX FILTERS END ----------------------------------------------------------------------------

        // CHECKBOX FILTERS SYNC FUNCTIONS WITH BINDDING START ---------------------------------------------
        /**
         * @ngdoc method
         * @name ng.controller:PolicyController#toogleCountryClick
         * @param {$event} $event from the browser
         * @param {number} $index track by ng-repeat
         * @methodOf all-ages.policies.controller:PolicyController
         * @description
         * My Description rules
         */
        $scope.toogleCountryClick = function ($event, $index) {
            $log.debug('addCountryClick CLICK');
            var element = angular.element($event.currentTarget);
            if (element.prop('checked')) {
                $scope.searchParams.countries.push(element.attr('value'));
            } else {
                $scope.searchParams.countries.splice($scope.searchParams.countries.indexOf(element.attr('value')), 1);
            }

            search($event);
        };

        /**
         * @ngdoc method
         * @name ng.controller:PolicyController#toogleClassificationClick
         * @param {$event} $event from the browser
         * @param {number} $index track by ng-repeat
         * @methodOf all-ages.policies.controller:PolicyController
         * @description
         * My Description rules
         */
        $scope.toogleClassificationClick = function ($event, $index) {
            $log.debug('addclassificationClick CLICK');
            var element = angular.element($event.currentTarget);
            if (element.prop('checked')) {
                if(element.attr('value')==$scope.i18n.OSHText) {
                    element.attr('value','OSH');
                }
                if(element.attr('value')==$scope.i18n.RTWText) {
                    element.attr('value','RTW');
                }

                $scope.searchParams.classifications.push(element.attr('value'));
            } else {
                $scope.searchParams.classifications.splice($scope.searchParams.classifications.indexOf(element.attr('value')), 1);
            }

            search($event);
        };
        // CHECKBOX FILTERS SYNC FUNCTIONS WITH BINDDING END -----------------------------------------------

        // SEE MORE FEATURE START --------------------------------------------------------------------------
        /**
         * @ngdoc method
         * @name ng.controller:PolicyController#seeMore
         * @param {$event} $event from the browser
         * @param {number} $index from ng-repeat
         * @methodOf all-ages.policies.controller:PolicyController
         * @description
         * My Description rules
         */
        $scope.seeMore = function ($event, $index) {
            $log.debug('EXPAND CLICK');


            var id = "long-description-" + $index;
            var elemento = document.getElementById(id);
            var element2 = angular.element(elemento);
            element2.toggleClass('expanded');

            var element = angular.element(element);
            element.toggleClass('hide');

            angular.element(".know-more.seemore:eq(" + $index + ")").toggleClass('up');


            var path = configService.getImagesPath();

        };
        // SEE MORE FEATURE END ----------------------------------------------------------------------------

        //CLICK ENTER --------------------------------------------------------------------------------------
        $scope.clickEnter = function ($event) {
            if ($event.which === 13) {
                search($event);
            }
        }

        // SEARCH START ------------------------------------------------------------------------------------
        /**
         * @ngdoc method
         * @name ng.controller:PolicyController#search
         * @param {$event} $event from the browser
         * @methodOf all-ages.policies.controller:PolicyController
         * @description
         * My Description rules
         */
        function search($event) { // policy is optional

            var policy = $('#policy-input').val();
            $log.debug('policy free text: ' + policy);
            $log.debug('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
            $log.debug($scope.searchParams.countries);
            dataService.getPLList(policy, $scope.searchParams.classifications, $scope.searchParams.countries)
                .then(function (data) {
                    for(var i=0;i<data.data.resultset.length;i++) {
                        var valor = data.data.resultset[i][7];
                        if(valor=='OSH') {
                            data.data.resultset[i][7]=$scope.i18n.OSHText;
                        }
                        if(valor=='RTW') {
                            data.data.resultset[i][7]=$scope.i18n.RTWText;
                        }
                    }

                    $scope.policies = dataService.dataMapper(data);

                    if ($scope.seeAllCountryPolicy) {
                        $scope.seeAllCountryPolicy = false;
                    }
                    $scope.firstPage();

                    $log.debug("Search policies results");
                    $log.debug($scope.policies);

                    $scope.paginationText = $scope.i18n.Displaying + " " + $scope.elementsStart + "-" + $scope.elementsEnd + " " + $scope.i18n.of + " " + $scope.policies.length;
                    $state.transitionTo('policy', {}, {notify: false});

                    setTimeout(function() {
                        seeMoreLimpiar();
                    },200);

                }).catch(function (err) {
                throw err;




            });

            $scope.currentPage = 0;
            
        }

        $scope.search = search;
        // SEARCH END --------------------------------------------------------------------------------------

        // POLICY DETAIL FILTER START ----------------------------------------------------------------------
        /**
         * @ngdoc method
         * @name ng.controller:PolicyController#searchPolicyDetail
         * @param {number} policyId Idof the policy
         * @methodOf all-ages.policies.controller:PolicyController
         * @description
         * My Description rules
         */
        function searchPolicyDetail(policyId) {
            $scope.paginationHidden = true;
            dataService.getPolicyDetail(policyId)
                .then(function (data) {
                    $log.debug("POLICY DETAIL");
                    $log.debug(data);

                    $scope.policies = dataService.dataMapper(data);
                    $scope.seeAllCountryPolicy = true;
                    setTimeout(function () {
                        var policyBtn = document.querySelector('.buttonmoreless');
                        var hideInformation = document.querySelector('.hide');
                        var policyDescription = document.querySelector('div.policy-description');
                        policyDescription.className += ' expanded';
                        angular.element(".know-more.seemore").addClass('up');
                    }, 50);
                    setTimeout(function() {
                        seeMoreLimpiar();
                    },200);

                }).catch(function (err) {
                throw err;
            });
        }

        // POLICY DETAIL FILTER END ------------------------------------------------------------------------

        // SEARCH SEE ALL POLICIES BY COUNTRY START --------------------------------------------------------
        /**
         * @ngdoc method
         * @name ng.controller:PolicyController#searchSeeAllPoliciesCountry
         * @param {string} country Country ID
         * @methodOf all-ages.policies.controller:PolicyController
         * @description
         * My Description rules
         */
        function searchSeeAllPoliciesCountry(country) {

            dataService.getPLList("", "", [country])
                .then(function (data) {
                    $scope.policies = dataService.dataMapper(data);
                    $log.debug($scope.policies);
                    setTimeout(function() {
                        seeMoreLimpiar();
                    },200);
                }).catch(function (err) {
                throw err;
            });
        }

        // SEARCH SEE ALL POLICIES BY COUNTRY END ----------------------------------------------------------

        // CLEAR FUNCTION START ----------------------------------------------------------------------------
        /**
         * @ngdoc method
         * @name ng.controller:PolicyController#clear
         * @param {$event} $event from the browser
         * @methodOf all-ages.policies.controller:PolicyController
         * @description
         * My Description rules
         */
        $scope.clear = function ($event) {
            $scope.paginationHidden = false;
            $scope.searchParams.classifications = [];
            $scope.searchParams.countries = [];
            $scope.searchParams.policies = [];
            var classifications = document.querySelectorAll('#filter1 > div.col-xs-12 > div.filters > input');
            var countries = document.querySelectorAll('#filter2 > div.col-xs-12 > div.filters > input');

            $log.debug(classifications);
            $log.debug(countries);

            [].forEach.call(classifications, function (classification, index) {
                classification.checked = false;
            });

            [].forEach.call(countries, function (country, index) {
                country.checked = false;
            });

            var policyInput = document.querySelector('#policy-input');
            policyInput.value = "";

            $scope.search();
            $scope.currentPage = 0;

            $state.transitionTo('policy', {}, {notify: false});
            setTimeout(function() {
                seeMoreLimpiar();
            },200);

        };
        // CLEAR FUNCTION END ----------------------------------------------------------------------------


        // PAGINATION START --------------------------------------------------------------------------------

        /**
         * @ngdoc method
         * @name ng.controller:PolicyController#numberOfPages
         * @methodOf all-ages.policies.controller:PolicyController
         * @description
         * My Description rules
         */
        $scope.numberOfPages = function () {
            return Math.ceil($scope.policies.length / $scope.pageSize);
        };

        /**
         * @ngdoc method
         * @name ng.controller:PolicyController#firstPage
         * @methodOf all-ages.policies.controller:PolicyController
         * @description
         * My Description rules
         */
        $scope.firstPage = function () {
            $scope.currentPage = 0;


            $scope.elementsStart = 1;
            $scope.elementsEnd = $scope.pageSize;

            if ($scope.elementsStart > 9) {
                $scope.elementsStart = $scope.elementsStart + 1;
            }
            $scope.elementsEnd = $scope.elementsStart + ($scope.pageSize - 1);

            if ($scope.elementsEnd > $scope.policies.length) {
                $scope.elementsEnd = $scope.policies.length;
            }

            $scope.paginationText = $scope.i18n.Displaying + " " + $scope.elementsStart + "-" + $scope.elementsEnd + " " + $scope.i18n.of + " " + $scope.policies.length;
            setTimeout(function() {
                seeMoreLimpiar();
            },200);
        };

        /**
         * @ngdoc method
         * @name ng.controller:PolicyController#previousPage
         * @methodOf all-ages.policies.controller:PolicyController
         * @description
         * My Description rules
         */
        $scope.previousPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
                if ($scope.currentPage > 0) {
                    $scope.elementsStart = $scope.currentPage * $scope.pageSize;
                    $scope.elementsEnd = $scope.elementsStart + $scope.pageSize;
                } else {
                    $scope.elementsStart = 1;
                    if ($scope.pageSize <= $scope.policies.length) {
                        $scope.elementsEnd = $scope.pageSize;
                    } else {
                        $scope.elementsEnd = $scope.policies.length;
                    }
                }
            } else {
                $scope.currentPage = 0;
                $scope.elementsStart = 1;
                $scope.elementsEnd = $scope.pageSize;
            }


            if ($scope.elementsStart > 9) {
                $scope.elementsStart = $scope.elementsStart + 1;
            }
            $scope.elementsEnd = $scope.elementsStart + ($scope.pageSize - 1);

            if ($scope.elementsEnd > $scope.policies.length) {
                $scope.elementsEnd = $scope.policies.length;
            }
            $scope.paginationText = $scope.i18n.Displaying + " " + $scope.elementsStart + "-" + $scope.elementsEnd + " " + $scope.i18n.of + " " + $scope.policies.length;
            setTimeout(function() {
                seeMoreLimpiar();
            },200);
        };

        /**
         * @ngdoc method
         * @name ng.controller:PolicyController#nextPage
         * @methodOf all-ages.policies.controller:PolicyController
         * @description
         * My Description rules
         */
        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.policies.length / $scope.pageSize - 1) {
                $scope.currentPage++;

                $scope.elementsStart = $scope.currentPage * $scope.pageSize;
                if ($scope.elementsStart + $scope.pageSize <= $scope.policies.length) {
                    $scope.elementsEnd = $scope.elementsStart + $scope.pageSize;
                } else {
                    $scope.elementsEnd = $scope.policies.length;
                }

                if ($scope.elementsStart > 9) {
                    $scope.elementsStart = $scope.elementsStart + 1;
                }
                $scope.elementsEnd = $scope.elementsStart + ($scope.pageSize - 1);

                if ($scope.elementsEnd > $scope.policies.length) {
                    $scope.elementsEnd = $scope.policies.length;
                }
                $scope.paginationText = $scope.i18n.Displaying + " " + $scope.elementsStart + "-" + $scope.elementsEnd + " " + $scope.i18n.of + " " + $scope.policies.length;
                setTimeout(function() {
                    seeMoreLimpiar();
                },200);
            }
        };

        /**
         * @ngdoc method
         * @name ng.controller:PolicyController#lastPage
         * @methodOf all-ages.policies.controller:PolicyController
         * @description
         * My Description rules
         */
        $scope.lastPage = function () {
            var resto = Math.floor($scope.policies.length / $scope.pageSize);
            $scope.currentPage = resto;


            if( $scope.currentPage==$scope.numberOfPages()) {
               $scope.currentPage=$scope.currentPage-1;
            }

            $scope.elementsStart = $scope.currentPage * $scope.pageSize;
            if ($scope.elementsStart + $scope.pageSize <= $scope.policies.length) {
                $scope.elementsEnd = $scope.elementsStart + $scope.pageSize;
            } else {
                $scope.elementsEnd = $scope.policies.length;
            }

            if ($scope.elementsStart > 9) {
                $scope.elementsStart = $scope.elementsStart + 1;
            }
            $scope.elementsEnd = $scope.elementsStart + ($scope.pageSize - 1);

            if ($scope.elementsEnd > $scope.policies.length) {
                $scope.elementsEnd = $scope.policies.length;
            }

            $scope.paginationText = $scope.i18n.Displaying + " " + $scope.elementsStart + "-" + $scope.elementsEnd + " " + $scope.i18n.of + " " + $scope.policies.length;
            setTimeout(function() {
                seeMoreLimpiar();
            },200);
            
        };


        // PAGINATION END ----------------------------------------------------------------------------------


        // DEFAULT STATE OF VIEW INSTANCES START -----------------------------------------------------------
        if (!!$stateParams.policy && $stateParams.policy !== "") {
            $log.debug('searchsearchPolicyDetail ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
            searchPolicyDetail($stateParams.policy);
        } else if (!!$stateParams.country && $stateParams.country !== "") {
            $log.debug('searchSeeAllPoliciesCountry ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
            searchSeeAllPoliciesCountry($stateParams.country);
        } else {
            $log.debug('search ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
            search();
        }
        // DEFAULT STATE OF VIEW INSTANCES END -------------------------------------------------------------



    }
    
    controller.$inject = ['$scope', '$stateParams', '$state', 'dataService', 'mapProvider', '$log','configService','$document', '$compile'];
    return controller;
    
});