define(function (require) {

    var AproachService = function () {

        var i18n = require('json!vertical/approaches/i18n');

        /* Policies data mapper structure */
        function Policy(group, countryID, country, pId, psp, main, csname, csurl, shortd, inMap) {
            this.countryId = countryID;
            this.country = country;
            this.group = group;
            this.policyId = pId;
            this.policy = psp;
            this.shortd = shortd;
            this.csname = csname;
            this.isMain = main == 1;
            this.csurl = csurl;
            this.inMap = inMap == 1;
        }

        function Factor(factor, factorBlock) {
            this.factor = factor;
            this.block = factorBlock;
        }

        function createPolicyWith(mapper) {
            return new Policy(mapper[0], mapper[1], mapper[2], mapper[3], mapper[4], mapper[5], mapper[6], mapper[7], mapper[8], mapper[9]);
        }

        function update(policy, index, $scope) {
            if (policy.isMain && policy.inMap) {
                $scope.countries[index].policies.main.push(policy);
            }
            else if (policy.inMap) {
                $scope.countries[index].policies.other.push(policy);
            }
            return $scope;
        }

        function insert(policy, index, $scope) {
            $scope.countries[index] = {
                name: policy.country,
                countryId: policy.countryId,
                policies: {
                    main: [],
                    other: []
                }
            };
            update(policy, index, $scope);
            return $scope
        }

        function createFactorWith(mapper) {
            return new Factor(mapper[1], mapper[2]);
        }

        function updateF(factor, index, $scope) {
            $scope.groups[index].factors.push(factor);
            return $scope;
        }

        function insertF(factor, index, $scope) {
            $scope.groups[index] = {
                factors: []
            };
            updateF(factor, index, $scope);
            return $scope;
        };

        function clickAction($scope, indicator) {
            $scope.indicatorIndex = indicator;
        }

        return {
            getTab2MainPoliciesData: function ($scope) {
                $scope.dashboard.promises.tab2MainPolicies.then(function (dataset) {

                    var result = dataset.data.resultset;
                    $scope.countries = [];
                    var country = {};
                    var policy = {};
                    var mapper = {};
                    var countriesIndex = 0;

                    for (var index in result) {
                        mapper = result[index];
                        country = $scope.countries[countriesIndex];
                        policy = createPolicyWith(mapper);

                        if (!country) {
                            insert(policy, countriesIndex, $scope);
                        }
                        else {
                            if (country.countryId !== policy.countryId) {
                                countriesIndex += 1;
                                insert(policy, countriesIndex, $scope);
                            }
                            else {
                                update(policy, countriesIndex, $scope);
                            }

                        }
                    }
                    return $scope;
                }).catch(function (err) {
                    throw err;
                });

            },
            getTab1GroupDescriptionData: function ($scope) {
                $scope.dashboard.promises.tab1GroupDescription.then(function (dataset) {
                    //"Group id is the index position + 1, beacause the 0 group isn't exist"
                    $scope.groups = [];
                    var mapper = {};
                    var group = {};
                    var factor = {};
                    var result = dataset.data.resultset;
                    for (var index in result) {
                        mapper = result[index];
                        group = $scope.groups[(mapper[0] - 1).toString()];
                        factor = createFactorWith(mapper);

                        if (!group) {
                            insertF(factor, mapper[0] - 1, $scope);
                        }
                        else {
                            updateF(factor, mapper[0] - 1, $scope);
                        }
                    }
                }).catch(function (err) {
                    throw err;
                });
                return $scope;
            },
            getIndicatorList: function ($scope,$state) {
                return [
                    // 0
                    {
                        id: 'getAPMedianAge',
                        title: 'Median Age',
                        type: 'lines',
                        colorRole: 's',
                        clickAction: function () {
                            $state.go('approaches-enlarge', {
                                indicator: 'median-age-time-series',
                                pGroup : "group" + $scope.dashboard.parameters.approach
                            });
                        },
                        axisMin: 25,
                        axisMax: 55,
                        step: 5,
                        orthoAxisTitle:i18n.units.years
                        
                    },
                    // 1
                    {
                        id: 'getAPUnemployement',
                        title: 'Unemployement',
                        type: 'lines',
                        colorRole: 's',
                        clickAction: function () {
                            $state.go('approaches-enlarge', {
                                indicator: 'unemployment',
                                pGroup : "group" + $scope.dashboard.parameters.approach
                            });
                        },
                        axisMin: 0,
                        axisMax: 30,
                        step: 5,
                        axisPercent: 1
                    },
                    // 2
                    {
                        id: 'getAPEmployementOlderWorkers',
                        title: 'Older workers employment rates',
                        type: 'lines',
                        colorRole: 's',
                        clickAction: function () {
                            $state.go('approaches-enlarge', {
                                indicator: 'older-workers-employment-rates',
                                pGroup : "group" + $scope.dashboard.parameters.approach
                            });
                        },
                        axisMin: 15,
                        axisMax: 100,
                        step: 25,
                        axisPercent: 1
                    },
                    // 3
                    {
                        id: 'getAPOpinionWorkHN',
                        title: 'Impact of work on health',
                        type: 'bars',
                        colorRole: 'c',
                        clickAction: function () {
                            $state.go('approaches-enlarge', {
                                indicator: 'impact-of-work-on-health',
                                pGroup : "group" + $scope.dashboard.parameters.approach
                            });
                        },
                        axisMax: 100,
                        step: 20,
                        axisPercent: 1
                    },
                    // 4
                    {
                        id: 'getAgeDiscrimination',
                        title: 'Age Discrimination',
                        type: 'bars',
                        colorRole: 'c',
                        clickAction: function () {
                            $state.go('approaches-enlarge', {
                                indicator: 'age-discrimination',
                                pGroup : "group" + $scope.dashboard.parameters.approach
                            });
                        },
                        axisMin: 10, // TODO esto esta desdoblado con la directiva vista normal, unificar
                        axisMax: 80,
                        step: 25,
                        axisPercent: 1
                    },
                    // 5
                    {
                        id: 'getTrainingOlderWorkers',
                        title: 'Participation of training of older workers',
                        type: 'bars',
                        colorRole: 'c',
                        clickAction: function () {
                            $state.go('approaches-enlarge', {
                                indicator: 'participation-in-training',
                                pGroup : "group" + $scope.dashboard.parameters.approach
                            });
                        },
                        axisMax: 70,
                        step: 25,
                        axisPercent: 1
                    }
                ];
            }
        };
    };

    AproachService.$inject = [];

    return AproachService;
});