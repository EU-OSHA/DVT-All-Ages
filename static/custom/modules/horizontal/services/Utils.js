/**
 * @ngdoc service
 * @name dvt.configModule.utilsService
 * @requires colors.json
 */
define(function (require) {

    var Utils = function () {

        var colors = require('json!horizontal/model/colors');

        return {

            /**
             * @ngdoc method
             * @name dvt.configModule.configService#executeFunctionByName
             * @param {string} carl is awesome
             * @methodOf dvt.configModule.configService
             * @description
             * My Description rules
             */
            getColorCountry: function(country){
                switch (country){
                    case -1:
                        return colors.baseOver;
                    case 0:
                        return colors.base;
                    case 1:
                        return colors.country1;
                        break;
                    case 12:
                        return colors.country12;
                        break;
                    case 2:
                        return colors.country2;
                        break;
                    case 22:
                        return colors.country22;
                        break;
                    case "1-overlapping":
                        return colors["comparison-first-pyramid-overlapping"];
                        break;
                    case "2-overlapping":
                        return colors["comparison-second-pyramid-overlapping"];
                        break;
                    default:
                        return this.getEUColor();
                }
            },

            /**
             * @ngdoc method
             * @name dvt.configModule.configService#executeFunctionByName
             * @param {string} carl is awesome
             * @methodOf dvt.configModule.configService
             * @description
             * My Description rules
             */
            getGroupColor: function (group) {
                switch (group) {
                    case '1':
                        return colors.group1;
                        break;
                    case '2':
                        return colors.group2;
                        break;
                    case '3':
                        return colors.group3;
                        break;
                    case '4':
                        return colors.group4;
                        break;
                    default:
                        return colors.group1;
                }
            },

            /**
             * @ngdoc method
             * @name dvt.configModule.configService#executeFunctionByName
             * @param {string} carl is awesome
             * @methodOf dvt.configModule.configService
             * @description
             * My Description rules
             */
            getEUColor: function(tone) {
                switch (tone){
                    case 2:
                        return colors.europe2;
                        break;
                    default:
                        return colors.europe;
                }
            },

            /**
             * @ngdoc method
             * @name dvt.configModule.configService#executeFunctionByName
             * @param {string} carl is awesome
             * @methodOf dvt.configModule.configService
             * @description
             * My Description rules
             */
            getEUMapBaseColor: function(){
                return colors.europeMapBase;
            },

            /**
             * @ngdoc method
             * @name dvt.configModule.configService#executeFunctionByName
             * @param {string} carl is awesome
             * @methodOf dvt.configModule.configService
             * @description
             * My Description rules
             */
            getEUTooltipColor: function(){
                return colors.EUTooltip;
            },

            /**
             * @ngdoc method
             * @name dvt.configModule.configService#executeFunctionByName
             * @param {string} carl is awesome
             * @methodOf dvt.configModule.configService
             * @description
             * My Description rules
             */
            getTooltipFontColor: function () {
                return colors.EUTooltipFontColor;
            },

            /**
             * @ngdoc method
             * @name dvt.configModule.configService#executeFunctionByName
             * @param {string} carl is awesome
             * @methodOf dvt.configModule.configService
             * @description
             * My Description rules
             */
            getEUTooltipStrokeColor: function(){
                return colors.EUTooltipStroketColor;
            },
            fixGroupColor: function (group, $scope) {
                $scope.dashboard.parameters['pEUColor'] = this.getEUColor();
                $scope.dashboard.parameters.pGroupColor = this.getGroupColor(group);
                $scope.dashboard.parameters.pColor1 = this.getGroupColor('1');
                $scope.dashboard.parameters.pColor2 = this.getGroupColor('2');
                $scope.dashboard.parameters.pColor3 = this.getGroupColor('3');
                $scope.dashboard.parameters.pColor4 = this.getGroupColor('4');
                return $scope;
            },

            getSpiderIndicator: function (color){
                switch (color){
                    case 1:
                        return colors.spider.indicator1;
                        break;
                    default:
                        return colors.spider.indicator0;
                }
            },

            getSpiderValuesColor: function () {
              return colors.spider.valuesColor;
            },

            /**
             * @ngdoc method
             * @name dvt.configModule.configService#executeFunctionByName
             * @param {string} carl is awesome
             * @methodOf dvt.configModule.configService
             * @description
             * My Description rules
             */
            setCDAIn: function (vertical) {
                switch (vertical) {
                    case 'CA':
                        return "all-ages/dashboards/approachdata.cda";
                        break;
                    case 'IS':
                        return "all-ages/dashboards/issuedata.cda";
                        break;
                    default:
                        return "all-ages/dashboards/datapilot.cda";
                }
            },

            /**
             * @ngdoc method
             * @name dvt.configModule.configService#executeFunctionByName
             * @param {string} carl is awesome
             * @methodOf dvt.configModule.configService
             * @description
             * My Description rules
             */
            executeFunctionByName: function(functionName, context, args) {
                var args = [].slice.call(arguments).splice(2);
                var namespaces = functionName.split(".");
                var func = namespaces.pop();
                for(var i = 0; i < namespaces.length; i++) {
                    context = context[namespaces[i]];
                }
                return context[func].apply(context, args);
            }

        }
    };

    Utils.$inject = [];

    return Utils;
});


