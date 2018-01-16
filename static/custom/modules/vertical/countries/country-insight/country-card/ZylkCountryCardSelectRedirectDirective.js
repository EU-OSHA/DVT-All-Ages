/**
 * @ngdoc directive
 * @name all-ages.countries.directive:ZylkSelectRedirect
 * @scope
 * @restrict E
 * @description
 * A description of the directive
 *
 */
define(function (require) {
    'use strict';

    var SelectComponent = require('cdf/components/SelectComponent');
    var configService = require('horizontal/config/configService');

    var sequence = 1;

    function nextId() {
        return sequence++;
    }

    // Ver:  https://docs.angularjs.org/api/ng/type/ngModel.NgModelController
    function ZylkSelectRedirectDirective($state, $log) {
        return {
            restrict: 'E'
            , require: ['ngModel', '^zylkDashboard']
            , scope: {
                params: '=',
                listenTo: '='
            }
            // TODO #iru: no consigo hacer funcionar esto sin usar tempalte (vs. templateUrl)
            ,template: '<div class="dropdown"><div class="input-group"> <span class="input-group-addon glyphicon glyphicon-stop" aria-hidden="false"></span> <span ng-attr-id="{{id}}" /></div></div>'
            //, templateUrl: configService.getHorizontalDirectiveTplPath('select', 'select')
            , link: function (scope, element, attributes, controllers) {
                var ngModel = controllers[0];
                var dashboard = controllers[1];

                scope.id = "zylk_select_redirect_" + nextId();

                var definition = {
                    name: scope.id
                    , type: "selectComponent"
                    , parameter: attributes.parameter
                    ,lifecycle : {silent: true}
                    , listeners: []
                    , priority: 1
                    , valueAsId: false
                    , externalPlugin: "select2"
                    , htmlObject: scope.id
                    , executeAtStart: true
                    , queryDefinition: {
                        dataAccessId: attributes.query
                        , path: attributes.cda
                    }
                    , postChange: function (selected) {
                        var def = undefined;
                        if(dashboard.pCountry2 == undefined) {
                            def = attributes.parameter;
                            dashboard.pCountry2 = def;
                        }
                        if(dashboard.pCountry2 !== undefined && dashboard.pCountry2 !== def) {
                            dashboard.dashboard.fireChange(attributes.parameter, selected);
                            ngModel.$setViewValue(selected, 'change');
                            $log.debug(attributes.parameter + ' @ ' + dashboard.pCountry2);
                            $log.debug(dashboard.pCountry1);
                            $state.go('country-comparison', {
                                pCountry1: dashboard.dashboard.parameters.pCountry1,
                                pCountry2: dashboard.dashboard.parameters.pCountry2
                            });
                        }
                        $log.debug(dashboard);
                    }
                    , postExecution: function () {

                        var divs = document.querySelectorAll('div.select2-container');
                        [].forEach.call(divs, function(div) {
                            div.classList.add('btn', 'btn-default', 'dropdown-toggle', 'col-xs-12');
                        });

                    }, postFetch: function(data){
                        $log.debug('##### ' + attributes.invalidateDefaultSelection);
                        if (attributes.invalidateDefaultSelection){
                            data.resultset.unshift(['-1','Select a country to compare']);
                            data.queryInfo.totalRows++;
                        }
                    }
                };

                if (!!scope.params)
                    definition.parameters = scope.params;

                if (!!scope.listenTo){
                    for (var listen in scope.listenTo) {
                        definition.listeners[listen] = scope.listenTo[listen];
                    }
                }

                $log.debug("Soy el link########################################" + scope.id);
                $log.debug(definition);

                dashboard.register(new SelectComponent(definition));
            }
        }
    }

    ZylkSelectRedirectDirective.$inject = ['$state', '$log'];

    return ZylkSelectRedirectDirective;
});
