 define(function (require) {

    var i18n = require('json!vertical/countries/i18n');
     
     function isnodeType1(element, index, array) {
         return element.nodeType === 1;
     }


    var CountryService = function ($state, dataService, $log, $q, configService, $compile) {

        var seeMoref=function(idDiv,idLink) {
            angular.element("." + idDiv).toggleClass('minimun');
            angular.element("." + idLink).toggleClass('up');
        };

        var isHTML = function(str) {
            var doc = new DOMParser().parseFromString(str, "text/html");
            if (doc != undefined && doc.body != undefined){
                return [].slice.call(doc.body.childNodes).some(isnodeType1);
            }else{
                return true;
            }
        };

        var _asignarEventosShapes = function(divSelector, scope){

            angular.element(divSelector + " .mapGrouping").each(function(i) {
                if (parseInt(i) != 0){
                    angular.element(this).click(function() {
                        angular.element(".mapGrouping").removeClass("marked");
                        angular.element(this).addClass("marked");
                        angular.element(".actionsMaps a").css('visibility','hidden');
                        angular.element(this).find(".actionsMaps a").css('visibility','visible');
                    });
                }
            });


            angular.element(".seeCard").each(function() {
                angular.element(this).click(function() {
                    var clase=angular.element(".marked").attr("class");
                    var trozos=clase.split("_");
                    $state.go('country-card', {pCountry1:trozos[1].replace(' marked','')});

                });
            });


            angular.element(".compare").each(function() {
                angular.element(this).click(function() {
                    var clase=angular.element(".marked").attr("class");
                    var trozos=clase.split("_");
                    $state.transitionTo('country-comparison', {
                        pCountry1: scope.pCountry1,
                        pCountry2: trozos[1].replace(' marked','')
                    });
                });
            });
        };

        return {

            asignarEventosShapes: _asignarEventosShapes,
            buildGroupingBlocks: function (scope, country, element, attributes) {

                dataService.getCountryCardGrouping(country).then(function (dataset) {
                    var entryDesign = $('<div></div>').load(configService.getVerticalTplPath('countries/country-insight/partials/sections', 'grouping'), function(){
                        var contentElem = element.find('div.section-content');
                        var group = {
                            id: dataset.data['resultset'][0][0],
                            name: dataset.data['resultset'][0][1],
                            description: dataset.data['resultset'][0][2],
                            countries: []
                        };

                        var bloqName = entryDesign.find('div.grouping-bloq-name');
                        var bloqDescription = entryDesign.find('div.grouping-bloq-description');
                        var bloqCountries = entryDesign.find('div.grouping-bloq-countries');
                        var bloqCountry = entryDesign.find('div.grouping-bloq-country');

                        bloqName.html(group.name);
                        bloqDescription.html(group.description);

                        $log.info(group.id);

                        /*
                         * FIXME duplicated in
                         * - CountriesService
                         * - CountriesController
                         */
                        dataService.getCountryCardGroupingCountries(group.id).then(function (dataset) {
                                $log.debug('~~~~~~~~~~~~~~~~~~~~');
                                $log.debug(dataset.data.resultset);
                                bloqCountries.html('');
                                var cadena = '', firstCountry = '', otherCountries = '';
                                dataset.data.resultset.forEach(function (country, index) {
                                    var countryId = country[1].toLowerCase();
                                    if(scope.country!=country[1]) {
                                        var html =
                                            '<div class="col-md-2 mapGrouping _' + country[1] + '" >' +
                                            '<div class="containerMiniMap">' +
                                            '<i class="mg map-' + countryId + ' mg-5x"></i>' +
                                            '<div>' + country[0] + '</div>' +
                                            '</div>' +
                                            '<div class="actionsMaps">' +
                                            '<a class="know-more compare">Compare</a>' +
                                            '<a class="know-more seeCard">See card</a>' +
                                            '</div>' +
                                            '</div>';
                                        otherCountries += html;
                                    }else{
                                        firstCountry =
                                            '<div class="col-md-2 selected mapGrouping _' + country[1] + '">' +
                                            '<div class="selected containerMiniMap">' +
                                            '<i class="mg map-' + countryId + ' mg-5x"></i>' +
                                            '<div>' + country[0] + '</div>' +
                                            '</div>' +
                                            '</div>';
                                    }
                                });
                            cadena = firstCountry + otherCountries;

                                bloqCountries.html("<div class='containerMiniMaps'>" +
                                                    "<div class='movible'>"+cadena+"</div>" +
                                                    "<div class='controllersMove'>" +
                                                        "<div class='prev'>" +
                                                            "<i class='fa fa-angle-left' aria-hidden='true'></i>"+
                                                        "</div>" +
                                                        "<div class='next'>" +
                                                            "<i class='fa fa-angle-right' aria-hidden='true'>"+
                                                        "</div>" +
                                                    "</div>" +
                                                "</div>");
                               bloqCountry.remove();



                            var divSelector = (attributes.compare === "1")?".firstCompared":".lastCompared";
                            _asignarEventosShapes(divSelector, scope);

                            //===========================================
                            // FIXME
                            //  - todo esto se hace por duplicado en las 2 veces que se llama a cada grouping en CC
                            //===========================================
                                var ahoraMM="";

                                angular.element(window).resize(function() {
                                    var ahora = Date.now();
                                    if (ahora - ahoraMM > 1000){
                                        miniMaps();
                                        angular.element(".movible").css("margin-left", "35px");
                                    }
                                });

                                var miniMaps=function() {
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
                                };


                                miniMaps();

                        })
                        .catch(function (err) {
                            $log.warn("Country grouping data request && data link fail!");
                        });

                        contentElem.append(entryDesign);
                    });


                }).catch(function (err) {
                    $log.warn("Country grouping data request && data link fail!");
                });
            },

            buildPolicyBlocks: function (scope, country, element, attributes) {
                /*
                var promiseOSH =  dataService.getCCMainPolicies(country, 'OSH');
                var promiseRehab =  dataService.getCCMainPolicies(country, 'RTW');
                var promiseAll = $q.all([promiseOSH, promiseRehab]);
                */
                var promiseTodo=dataService.getCCMainPolicies2(country);
                var promiseAll = $q.all([promiseTodo]);
                
                promiseAll.then(function(policies) {

                    var entryDesign = $('<div></div>').load(configService.getVerticalTplPath('countries/country-insight/partials/sections', 'policies'), function(){
                        var policyBloq = entryDesign.find('div.contentP');

                        policies.forEach(function (policy) {
                            if(policy.data.resultset.length > 0) {
                                var bloqPolicies = policyBloq.clone();
                                var bloqTemp1 = bloqPolicies.find('div.policy-bloq');
                                policy.data.resultset.forEach(function (obj) {
                                    var clonedbloq = bloqTemp1.clone();
                                    clonedbloq.find('h3.title').html(i18n.policyTitles[obj[3]]);
                                    clonedbloq.find('h4.subtitle').html(obj[1]);
                                    if (isHTML(obj[2])) {
                                        clonedbloq.find('p.item').remove();
                                        var divItem = clonedbloq.find('div.item');
                                        divItem.html(obj[2]);
                                    } else {
                                        clonedbloq.find('div.item').remove();
                                        clonedbloq.find('p.item').html(obj[2]);
                                    }
                                    clonedbloq.find('a.know-more').attr('href', $state.href('policy', {policy: obj[0]}, { lossy: true }));
                                    bloqTemp1.after(clonedbloq);
                                });
                                bloqTemp1.remove();
                                policyBloq.parent().append(bloqPolicies);
                            }
                        });
                        policyBloq.remove();
                        var seeCountryPolicies = entryDesign.find('a.all-policies.know-more');
                        seeCountryPolicies.attr('href', $state.href('all-country-policies', {country: country}, { lossy: true }));
                        var contentElem = angular.element(element[0].querySelector('.section-content'));
                        contentElem.html('');
                        contentElem.append(entryDesign);

                    });

                });
            },

            buildOthersInitiativesBlocks: function (scope, country, element, attributes) {
                var promiseTodo=dataService.getCountryCardInitiatives(country);
                var promiseAll = $q.all([promiseTodo]);

                promiseAll.then(function(policies) {

                    var entryDesign = $('<div></div>').load(configService.getVerticalTplPath('countries/country-insight/partials/sections', 'iniciatives'), function(){
                        var policyBloq = entryDesign.find('div.contentP');
                        var contador=0;
                        policies.forEach(function (policy) {
                            if(policy.data.resultset.length > 0) {
                                var bloqPolicies = policyBloq.clone();
                                var bloqTemp1 = bloqPolicies.find('div.policy-bloq');
                                policy.data.resultset.forEach(function (obj) {
                                    var path=$state.current.name;
                                    //alert(path);
                                    if((path=="country-comparison" && contador<2) || (path!="country-comparison")) {
                                    //if((window.location.href.indexOf('country-comparison')!=-1 && contador<2) ||(window.location.href.indexOf('country-comparison')==-1)) {
                                        var clonedbloq = bloqTemp1.clone();
                                        clonedbloq.find('h3.title').html(obj[1]);
                                        if (isHTML(obj[2])) {
                                            $log.debug("isHTML true " + obj[2]);
                                            clonedbloq.find('p.item').remove();
                                            var divItem = clonedbloq.find('div.item');
                                            divItem.html(obj[2]);
                                        } else {
                                            $log.debug("isHTML false " + obj[2]);
                                            clonedbloq.find('div.item').remove();
                                            clonedbloq.find('p.item').html(obj[2]);
                                        }
                                        clonedbloq.find('a.know-more').attr('href', $state.href('policy', {policy: obj[0]}, {lossy: true}));
                                        bloqTemp1.after(clonedbloq);
                                        contador++;
                                    }
                                });
                                bloqTemp1.remove();
                                policyBloq.parent().append(bloqPolicies);
                            }
                        });
                        policyBloq.remove();
                        var seeCountryPolicies = entryDesign.find('a.all-policies.know-more');
                        seeCountryPolicies.attr('href', $state.href('all-country-policies', {country: country}, { lossy: true }));
                        var contentElem = angular.element(element[0].querySelector('.section-content'));
                        contentElem.html('');
                        contentElem.append(entryDesign);

                    });

                });

            },

            buildCircumstancesBlocks: function (scope, country, element, attributes) {

                dataService.getCountryCardCirumstances(country)
                    .then(function (dataset) {
                        var entryDesign = $('<div></div>').load(configService.getVerticalTplPath('countries/country-insight/partials/sections', 'context'), function() {
                            $log.debug('context: ' + dataset.data.resultset.length);
                            if(window.location.href.indexOf('country-comparison')!=-1) {
                                entryDesign.addClass("all-ages-container centered " + "compare" + attributes.compare);
                            } else {
                                entryDesign.addClass("all-ages-container centered");
                            }
                            var bloq = entryDesign.find('div.bloq');
                            dataset.data.resultset.forEach(function (circumstances) {
                                var clonedbloq = bloq.clone();
                                if (isHTML(circumstances[0]))  {
                                    clonedbloq.find('p.item').remove();
                                    var divItem = clonedbloq.find('div.item');
                                    divItem.html(circumstances[0]);
                                } else {
                                    clonedbloq.find('div.item').remove();
                                    clonedbloq.find('p.item').html(circumstances[0]);
                                }
                                bloq.after(clonedbloq);
                            });
                            var contentElem = element.find('div.section-content');
                            contentElem.html('');
                            contentElem.append(entryDesign);
                            if(window.location.href.indexOf('country-comparison')!=-1) {
                                angular.element(".circums").addClass('minimun');
                                angular.element(this).unbind("click").click(function() {
                                    seeMoref('circums','vdCircums');
                                });
                            } else {
                                angular.element(".circums").removeClass('minimun');
                                angular.element(".vdCircums").remove();
                            }
                            

                            bloq.remove();

                        });
                    })
                    .catch(function (err) {
                        $log.warn("context data request && data link fail!");
                    });
            },

            buildChallengesBlocks: function (scope, country, element, attributes) {
                dataService.getCountryCardChallenges(country)
                    .then(function (dataset) {
                        var entryDesign = $('<div></div>').load(configService.getVerticalTplPath('countries/country-insight/partials/sections', 'challenges'), function() {
                            $log.debug('challenges: ' + dataset.data.resultset.length);
                            if(window.location.href.indexOf('country-comparison')!=-1) {
                                entryDesign.addClass("all-ages-container centered " + "compare" + attributes.compare);
                            } else {
                                entryDesign.addClass("all-ages-container centered");
                            }
                            var bloq = entryDesign.find('div.bloq');
                            dataset.data.resultset.forEach(function (challenge) {
                                var clonedbloq = bloq.clone();
                                if (isHTML(challenge[0]))  {
                                    clonedbloq.find('p.item').remove();
                                    var divItem = clonedbloq.find('div.item');
                                    divItem.html(challenge[0]);
                                } else {
                                    clonedbloq.find('div.item').remove();
                                    clonedbloq.find('p.item').html(challenge[0]);
                                }
                                bloq.after(clonedbloq);
                            });
                            var contentElem = element.find('div.section-content');
                            contentElem.html('');
                            contentElem.append(entryDesign);


                            if(window.location.href.indexOf('country-comparison')!=-1) {
                                angular.element(".challeng").addClass('minimun');
                                angular.element(".vdChallenges").unbind("click").click(function() {
                                    seeMoref('challeng','vdChallenges');
                                });
                            } else {
                                angular.element(".challeng").removeClass('minimun');
                                angular.element(".vdChallenges").remove();
                            }



                            bloq.remove();

                        });
                    }).catch(function (err) {
                    $log.warn("challenges data request && data link fail!");
                });
            },

            buildStakeHoldersBlocks: function (scope, country, element, attributes) {
                dataService.getCountryCardStakeholders(country)
                    .then(function (dataset) {
                        var entryDesign = $('<div></div>').load(configService.getVerticalTplPath('countries/country-insight/partials/sections', 'stakeholders'), function() {
                            $log.debug('Stakeholders: ' + dataset.data.resultset.length);
                            if(window.location.href.indexOf('country-comparison')!=-1) {
                                entryDesign.addClass("all-ages-container centered " + "compare" + attributes.compare);
                            } else {
                                entryDesign.addClass("all-ages-container centered");
                            }
                            var bloq = entryDesign.find('div.bloq');
                            dataset.data.resultset.forEach(function (stakeholder) {
                                var clonedbloq = bloq.clone();
                                entryDesign.find('a.oshwiki').attr('href', stakeholder[1]);
                                entryDesign.find('a.know-more.glossary').attr('href', $state.href("glossary", {}, { lossy: true } ));

                                if (isHTML(stakeholder[0])) {
                                    clonedbloq.find('p.item').remove();
                                    var divItem = clonedbloq.find('div.item');
                                    divItem.html($compile(stakeholder[0])(scope));
                                } else {
                                    clonedbloq.find('div.item').remove();
                                    clonedbloq.find('p.item').html($compile(stakeholder[0])(scope));
                                }

                                bloq.after(clonedbloq);

                            });

                            var contentElem = element.find('div.section-content');
                            contentElem.html('');
                            contentElem.append(entryDesign);


                            if(window.location.href.indexOf('country-comparison')!=-1) {
                                angular.element(".stake").addClass('minimun');
                                angular.element(".vdStake").unbind("click").click(function() {
                                    seeMoref('stake','vdStake');
                                });
                            } else {
                                angular.element(".stake").removeClass('minimun');
                                angular.element(".vdStake").remove();
                            }

                            bloq.remove();

                        });
                    })
                    .catch(function (err) {
                        $log.warn("stakeholders data request && data link fail!");
                    });

            },
            getAnchorTime: {
                "country-card": 1500,
                "country-comparison": 3000
            }
        }
    };

    CountryService.$inject = ['$state', 'dataService', '$log', '$q','configService', '$compile'];

    return CountryService;
});
