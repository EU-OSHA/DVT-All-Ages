define(function (require) {
    'use strict';

    var sequence = 1;
    var configService = require('horizontal/config/configService');


    function nextId() {
        return sequence++;
    }

    function ZylkMenuIssueDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},

            controller: ['$scope', '$state', '$stateParams', 'configService', '$http', '$attrs', '$location', '$log',
                function ($scope, $state, $stateParams, configService, $http, $attrs, $location, $log) {

                    $scope.items =require('json!vertical/issue/menu/menu-items');

                     var pCountry1=$stateParams.pCountry1;
                     var pCountry2=$stateParams.pCountry2;

                     var itemsJson='[';

                     for(i=0;i<$scope.items.length;i++) {
                         var link=$scope.items[i].sref;
                         var srefSplit=link.split("(");
                         var sref=srefSplit[0]+"({'pCountry1': "+pCountry1+", 'pCountry2': "+pCountry2+"})";
                         var id=$scope.items[i].id;
                         var html=$scope.items[i].html;

                         var href="#!/key-issue/"+id+"/"+pCountry1+"/"+pCountry2;

                         itemsJson+='{ "id":"'+id+'","sref":"'+sref+'","html":"'+html+'","href":"'+href+'"},';
                     }

                     itemsJson=itemsJson.substring(0,itemsJson.length-1)+']';

                     $scope.itemsJsonTransformer = JSON.parse(itemsJson);


                     $scope.isCurrentStateMenu = function (path) {
                     var lPath = $location.path().split("/");
                     return (path === lPath[2]) ? 'selected' : '';
                     };


                   
            }],
            templateUrl: configService.getVerticalTplPath("issue/directives/menu-issue", "menu")
        }
    }


    return ZylkMenuIssueDirective;
});


