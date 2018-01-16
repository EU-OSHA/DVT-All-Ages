/**
 * @ngdoc controller
 * @name all-ages.countries.controller:CountriesController
 * @requires $scope
 * @requires $stateParams
 * @requires $state
 * @requires $document
 * @description
 * ############################################
 */
define(function (require) {
    'use strict';

        function controller($scope, $stateParams, $state, configService, $log, $http, dataService, mapProvider, dvtUtils, countriesService, plotsProvider, $document, $timeout) {

            var seeMoreLimpiar=function() {
                if (angular.element(".section-fix").find('.minimun').length>0) {
                    angular.element('.section-fix').each(function () {
                        var altura1 = angular.element(this).find('.minimun:eq(0)').height();
                        var altura2 = angular.element(this).find('.bloque:eq(0)').height();
                        var altura11 = angular.element(this).find('.minimun:eq(1)').height();
                        var altura22 = angular.element(this).find('.bloque:eq(1)').height();
                        if (altura2 <= altura1 && altura22 <= altura11) {
                            angular.element(this).find('.seemore').remove();
                        }
                    });
                }
            };

            $scope.$on('loaded', function(event, data) {
                setTimeout(function () {
                    if(angular.element(".containerMiniMaps").length>0) {
                        seeMoreLimpiar();
                    }
                    miniMaps();
                }, 2000);
            });


            /*
             * FIXME duplicated in
             * - CountriesService
             * - CountriesController
             */
            var ahoraMM="";

            angular.element(window).resize(function() {
                var ahora = Date.now();
                if (ahora - ahoraMM > 1000){
                    miniMaps();
                    angular.element(".movible").css("margin-left", "35px");
                }
            });

            var ejecutadoMinimaps=0;
            var miniMaps=function() {
                ejecutadoMinimaps=1;
                ahoraMM=Date.now();
                var anchoPais=134;
                var anchoWindow=angular.element(window).width();
                
                var paisesPorTanda=5;

                if(anchoWindow<=1480 && anchoWindow>1250) {
                    paisesPorTanda=4;
                }
                if(anchoWindow<=1250 && anchoWindow>975 || anchoWindow<=600) {
                    paisesPorTanda=3;
                }
                var movimiento=anchoPais*paisesPorTanda-(angular.element(".prev").width()*2)-(paisesPorTanda-1);
                var anchoContainer="704px";

                if(paisesPorTanda==4) {
                    anchoContainer="577px";
                    movimiento=508;
                }
                if(paisesPorTanda==3) {
                    anchoContainer="451px";
                    movimiento=381;
                }

                angular.element(".containerMiniMaps").each(function() {
                    var objeto= angular.element(this);
                    objeto.css("width",anchoContainer);

                    var repeticiones=angular.element(this).find(".mapGrouping").length;

                    var ancho=(repeticiones*anchoPais)+repeticiones;
                    objeto.find(".movible").css('width',ancho+'px');

                    var movimientosMax = Math.floor(repeticiones / paisesPorTanda);

                    if(repeticiones>paisesPorTanda) {
                        objeto.find(".controllersMove").show();
                    } else {
                        objeto.find(".controllersMove").hide();
                    }

                   var movimientoVoy=0;

                    objeto.find(".controllersMove .next").unbind("click").click(function () {
                        if(movimientoVoy<movimientosMax) {
                            movimientoVoy++;
                            angular.element(".actionsMaps a").css('visibility','hidden');
                            angular.element(".mapGrouping").removeClass("marked");
                            objeto.find(".movible").animate({
                                marginLeft: "-=" + movimiento,
                            }, 1000, function () {

                            });
                        }
                    });

                    objeto.find(".controllersMove .prev").unbind("click").click(function () {
                        if(movimientoVoy>0) {
                            movimientoVoy--;
                            angular.element(".actionsMaps a").css('visibility','hidden');
                            angular.element(".mapGrouping").removeClass("marked");
                            objeto.find(".movible").animate({
                                marginLeft: "+=" + movimiento,
                            }, 1000, function () {

                            });
                        }
                    });

                });

                // angular.element(".mapGrouping").each(function(i, element) {
                //     if (parseInt(i) != 0){
                //         angular.element(this).click(function() {
                //             angular.element(".mapGrouping").removeClass("marked");
                //             angular.element(this).addClass("marked");
                //             angular.element(".actionsMaps a").css('visibility','hidden');
                //             angular.element(this).find(".actionsMaps a").css('visibility','visible');
                //         });
                //     }
                // });


                // angular.element(".seeCard").each(function() {
                //     angular.element(this).click(function() {
                //         var clase=angular.element(".marked").attr("class");
                //         var trozos=clase.split("_");
                //         $state.go('country-card', {pCountry1:trozos[1].replace(' marked','')});
                //
                //     });
                // });
                //
                //
                // angular.element(".compare").each(function() {
                //     angular.element(this).click(function() {
                //         var clase=angular.element(".marked").attr("class");
                //         var trozos=clase.split("_");
                //         $state.transitionTo('country-comparison', {
                //             pCountry1: $scope.pCountry1,
                //             pCountry2: trozos[1].replace(' marked','')
                //         });
                //     });
                // });

            };

            /* data wrangling parameters*/

            $scope.cda = configService.getDataPilotPath();

            var i18n = {};
            switch ($state.current.name) {
                case "countries-selection-panel":
                    i18n = require('json!vertical/csp/i18n');
                    break;
                case "country-card":
                case "country-comparison":
                    i18n = require('json!vertical/countries/i18n');
                    dataService.getLinkReport($stateParams.pCountry2).then(function (dataset) {
                        $log.debug('Link Report2: ' + dataset.data.resultset.length);
                        dataset.data.resultset.forEach(function (linkReport) {
                            if(angular.element('#linkReport2').length>0) {
                                var elemento = document.getElementById('linkReport2');
                                if(linkReport[0]!=null) {
                                    elemento.setAttribute("href", linkReport[0]);
                                } else {
                                    elemento.remove();
                                }
                            }

                        });
                    }).catch(function (err) {
                        $log.warn("Link Report2 data request --> link fail!");
                    });
                    break;
            }
            $scope.i18n = i18n;


            /* Styles parameters */
            /** $stateParams params by URL **/
            /* Dashboard parameters*/
            $scope.pCountry1 = $stateParams.pCountry1;
            $scope.pCountry2 = $stateParams.pCountry2;

            $scope.pIndicator = $stateParams.pIndicator;
            $scope.dashboard = {
                parameters: {
                    "pCountry1": $stateParams.pCountry1,
                    "pCountry2": $stateParams.pCountry2,
                    "pColor1": dvtUtils.getColorCountry(1),
                    "pColor2": dvtUtils.getColorCountry(2),
                    "pColorEU": dvtUtils.getEUColor(1),
                    "pColorEU2": dvtUtils.getEUColor(2),
                    "pColor12": dvtUtils.getColorCountry(12),
                    "pColor22": dvtUtils.getColorCountry(22),
                    "1-overlapping" : dvtUtils.getColorCountry("comparison-first-pyramid-overlapping"),
                    "2-overlapping" : dvtUtils.getColorCountry("comparison-first-pyramid-overlapping")
                }
            };

            $scope.promises = {
                europePromise: mapProvider.getEuropeShape(),
                countryGroups: dataService.getGroupCountryList(),
                ccGrouping1: dataService.getCountryCardGrouping($scope.dashboard.parameters.pCountry1),
                ccGrouping2: dataService.getCountryCardGrouping($scope.dashboard.parameters.pCountry2)

            };

            $scope.dashboard.promises = $scope.promises;

            /* postFetch function to F&F charts dynamic colors */

            $scope.factsFigures = [
                {
                    barFillStyle: plotsProvider.getHLYbarFillStyle($scope.dashboard)
                },
                {
                    postFetch: function () {
                        var dashboard = this.dashboard;
                        var color1 = dashboard.getParameterValue("pColor1");
                        var color2 = dashboard.getParameterValue("pColor2");
                        var colorEU = dashboard.getParameterValue("pColorEU");
                        var country1 = dashboard.getParameterValue("pCountry1");
                        var country2 = dashboard.getParameterValue("pCountry2");
                        var europe = "EU";

                        this.chartDefinition.colorMap = {};
                        this.chartDefinition.colorMap[europe] = colorEU;
                        if (country1 != "EU") this.chartDefinition.colorMap[country1] = color1;
                        if (country2 != "EU") this.chartDefinition.colorMap[country2] = color2;
                    }

                }
            ];
            
            /**
             * @ngdoc method
             * @name ng.controller:CountriesController#refreshHash
             * @param {string} carl is awesome
             * @methodOf all-ages.countries.controller:CountriesController
             * @description
             * My Description rules
             */
            $scope.refreshHash = function () {
                $state.transitionTo('country-card', {
                    pCountry1: $scope.pCountry1
                });
            };

            /**
             * @ngdoc method
             * @name ng.controller:CountriesController#refreshCountryComparison
             * @param {string} carl is awesome
             * @methodOf all-ages.countries.controller:CountriesController
             * @description
             * My Description rules
             */
            $scope.refreshCountryComparison = function () {
                $state.transitionTo('country-comparison', {
                    pCountry1: $scope.pCountry1,
                    pCountry2: $scope.pCountry2
                });
            };

            /**
             * @ngdoc method
             * @name ng.controller:CountriesController#CountryComparisonRedirect
             * @param {string} carl is awesome
             * @methodOf all-ages.countries.controller:CountriesController
             * @description
             * My Description rules
             */
            $scope.CountryComparisonRedirect = function () {
                if (!!$stateParams.pCountry2) {
                    $state.transitionTo('country-comparison', {
                        pCountry1: $scope.pCountry1,
                        pCountry2: $scope.pCountry2
                    });
                }
                else {
                    $state.transitionTo('country-card', {
                        pCountry1: $scope.pCountry1
                    });
                }
            };


            $scope.figure2 = {
                labelTop: function (dataset) {

                    var height = this.chart.height - dataset.datum.atoms.value.value;
                    if (dataset.atoms.series.value == 'HLY') {
                        return height * 1.06;
                    } else {
                        return height * 0.40;
                    }
                },

                maxLabelTop: function (dataset) {

                    var height = this.chart.height - dataset.datum.atoms.value.value;
                    if (dataset.atoms.series.value == 'HLY') {
                        return height * 0.85;
                    } else {
                        return height * 0.40;
                    }
                },
                baseAxisLabelText: function (dataset) {
                    return dataset.atoms.category.value;
                },
                baseAxisLabelVisible: function (dataset) {
                    return dataset.dataIndex == 0 || dataset.dataIndex == 2;
                },
                dimensions: {
                    series: {
                        isHidden:true
                    }
                },
            };

            $scope.figure2.ccc = {
                baseAxisLabelVisible: function (dataset) {
                    return dataset.dataIndex == 1 || dataset.dataIndex == 4;
                }
            };

            $scope.figure3 = {
                plots: plotsProvider.getDonoughtPlots(3),
                calculations: plotsProvider.getCalculations(3),
                postfetch:plotsProvider.getDonutsDynamicColor
            };

            $scope.pyramid = {
                cc: [dvtUtils.getColorCountry(1), dvtUtils.getColorCountry(12), dvtUtils.getColorCountry("1-overlapping")],
                ccc: [dvtUtils.getColorCountry(2), dvtUtils.getColorCountry(22), dvtUtils.getColorCountry("2-overlapping")],
                colorMapccc: {
                    "Female": dvtUtils.getColorCountry(22),
                    "Male": dvtUtils.getColorCountry(2)
                },
                color2Mapccc: {
                    "Male": dvtUtils.getColorCountry(22),
                    "Female": dvtUtils.getColorCountry(2)
                }
            };

            dataService.getLinkReport($stateParams.pCountry1).then(function (dataset) {
                    $log.debug('Link Report1: ' + dataset.data.resultset.length);
                    dataset.data.resultset.forEach(function (linkReport) {
                        if(angular.element("#linkReport").length>0) {
                            var elemento = angular.element("#linkReport");
                            if (linkReport[0] != null) {
                                elemento.attr("href", linkReport[0]);
                            } else {
                                elemento.remove();
                            }
                        }
                    });
                }).catch(function (err) {
                $log.warn("Link Report data request --> link fail!");
            });

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
                
            })
            .catch(function (err) {
                $log.warn("getAllCountries data request fail!");
            });

            /* EU metadata */
            $scope.europe = {
                name: 'Europe',
                id: "EU"
            };
            /* Get groups-country list*/

            $scope.dashboard.promises.countryGroups.then(function (dataset) {
                $scope = dataService.createGroupCountryList($scope, dataset.data);
            });

            /* Get grouping section data in order to show ever in all browsers*/
            $scope.dashboard.promises.ccGrouping1.then(function (dataset) {
                $log.debug('############### CountriesController: loading group #################');
                $log.debug(dataset.data.resultset);
                if (dataset.data.resultset.length > 0) {
                    $scope.country1 = {
                        group: {
                            id: dataset.data['resultset'][0][0],
                            name: dataset.data['resultset'][0][1],
                            description: dataset.data['resultset'][0][2],
                            countries: []
                        }
                    };



                    /*
                      * duplicated in
                      * - CountriesService
                      * - CountriesController
                      */
                    dataService.getCountryCardGroupingCountries($scope.country1.group.id)
                        .then(function (dataset) {
                            $log.debug('############### CountriesController: loading grouping countries #################');
                            $log.debug(dataset.data.resultset);
                            var countriesList = dataset.data.resultset;
                            $scope.bloqCountries = '';
                            angular.element("#actionsMaps a").hide();


                            var cadena = '', firstCountry = '', otherCountries = '';
                            countriesList.forEach(function (country, index) {
                                var countryId=country[1].toLowerCase();
                               if($scope.pCountry1!=country[1]) {
                                    var html='<div class="col-md-2 mapGrouping _'+country[1]+'" >' +
                                                '<div class="containerMiniMap">' +
                                                    '<i class="mg map-'+countryId+' mg-5x"></i>' +
                                                    '<div>'+country[0]+'</div>' +
                                                '</div>' +
                                                '<div class="actionsMaps">' +
                                                    '<a class="know-more compare">Compare</a>' +
                                                    '<a class="know-more seeCard">See card</a>' +
                                                '</div>' +
                                             '</div>';
                                    otherCountries += html;

                               }else{
                                   firstCountry ='<div class="col-md-2 selected mapGrouping _'+country[1]+'" >' +
                                       '<div class="selected containerMiniMap">' +
                                       '<i class="mg map-'+countryId+' mg-5x"></i>' +
                                       '<div>'+country[0]+'</div>' +
                                       '</div>' +
                                       '</div>';
                               }
                            });

                            cadena = firstCountry + otherCountries;
                            $scope.bloqCountries = $scope.bloqCountries.concat(cadena);


                            $scope.bloqCountries="<div class='containerMiniMaps'>" +
                                                    "<div class='movible'>"+$scope.bloqCountries+"</div>" +
                                                    "<div class='controllersMove'>" +
                                                        "<div class='prev'>" +
                                                            "<i class='fa fa-angle-left' aria-hidden='true'></i>"+
                                                        "</div>" +
                                                        "<div class='next'>" +
                                                            "<i class='fa fa-angle-right' aria-hidden='true'>"+
                                                        "</div>" +
                                                    "</div>" +
                                                "</div>";


                            countriesService.asignarEventosShapes('', $scope);

                        });
                }
            });

            /* Colors for CC & CCC maps style*/

            $scope.mapColors = {
                euBg: dvtUtils.getColorCountry(-1),
                c1: dvtUtils.getGroupColor("1"),
                c2: dvtUtils.getGroupColor("2")
            };

            $document.scrollTo(0, 0);

        }

        controller.$inject = ['$scope', '$stateParams', '$state', 'configService', '$log', '$http', 'dataService', 'mapProvider', 'dvtUtils', 'countriesService', 'plotsProvider', '$document','$timeout'];
        return controller;
});
