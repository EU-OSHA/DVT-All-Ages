/**
 * @ngdoc service
 * @name dvt.configModule.configService
 * @requires configuration
 * @requires environment
 * @description
 * Service with config utils & setup
 * @description
 * HTMLElement.prototype.click Click event firefox override to map correct click event.
 */
define(function (require) {

    var configuration = require('json!horizontal/config/configuration'),
        environment = require('json!horizontal/config/environment');

    var pentahoInstance = configuration.paths['pentaho-instance'];

    var dataPath = pentahoInstance + configuration.paths.data['pentaho-path'];
    var imagesPath = pentahoInstance + configuration.paths.images;
    var verticalPath = pentahoInstance + configuration.paths.partials + "/modules/vertical/";
    var horizontalPath = pentahoInstance + configuration.paths['directive-route'] + "/modules/horizontal/";
    var horizontalPathDiretive = horizontalPath + "directives/";


    /**
     HTMLElement.prototype.click Click event firefox override to map correct click event.
     */
    HTMLElement.prototype.click = function () {
        var evt = this.ownerDocument.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        this.dispatchEvent(evt);
    };

    var _getPiwikInstance=function() {
        if (environment.do_track === false) {
            return [];

        } else {
            var url = configuration.paths.piwik[environment.piwik].protocol + ":" + configuration.paths.piwik[environment.piwik].domain + ":" + configuration.paths.piwik[environment.piwik].port + configuration.paths.piwik[environment.piwik].path;
            var basePath = configuration.paths.enviroment[environment.pentaho].domain + ":" + configuration.paths.enviroment[environment.pentaho].port + "/#!"
            if(typeof(_paq) == "undefined") {
                window._paq = [];
            }
            //window._paq.push(['trackPageView']);
            window._paq.push(['enableLinkTracking']);
            window._paq.push(['setTrackerUrl', url+'piwik.php']);
            window.piwikBasePath = basePath;
            window._paq.push(['setSiteId', configuration.paths.piwik[environment.piwik].SiteId]);

            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('head')[0];
            g.type='text/javascript'; g.async=true; g.defer=true; g.src=url +'piwik.js'; s.appendChild(g);
            return window._paq;
        }
    }

    return {

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#isDebugMode
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        isDebugMode: function () {
            return configuration.debugMode;
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#isDebugMode
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        isPacked: function () {
            return environment.packed;
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getImagesPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getImagesPath: function () {
            return pentahoInstance + configuration.paths.images;
        },

        // ----------------------------------
        //  verticals (tpl, style, directives)
        // ----------------------------------

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getVerticalPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getVerticalPath: function() {
            return verticalPath;
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getVerticalTplPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getVerticalTplPath: function (module, tplName) {
            return verticalPath + module + "/" + tplName + ((environment.packed)?".min":"") + ".html";
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getVerticalStylePath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getVerticalStylePath: function (module, tplName) {
            return verticalPath + module + "/" + tplName + ".css";
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getVerticalDirectiveTplPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getVerticalDirectiveTplPath: function (module, directiveName) {
            return verticalPath + module + "/" + directiveName + ((environment.packed)? ".min":"") + ".html";
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getVerticalDirectiveStylePath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getVerticalDirectiveStylePath: function (module, directiveName) {
            return verticalPath + module + "/" + directiveName + ".css";
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getVerticalDirectiveDataPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getVerticalDirectiveDataPath: function (module, directiveName) {
            return verticalPath + module + "/" + directiveName + ((environment.packed)?".min":"") + ".json";
        },

        // ----------------------------------
        //  Horizontal (directives, images)
        // ----------------------------------
        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getHorizontalPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getHorizontalPath: function(){
            return horizontalPath;
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getHorizontalDirectiveTplPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getHorizontalDirectiveTplPath: function (module, tplName) {
            return horizontalPathDiretive + module + "/" + tplName + ((environment.packed)? ".min":"") + ".html";
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getHorizontalDirectiveStylePath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getHorizontalDirectiveStylePath: function (directive, styleName) {
            return horizontalPathDiretive + directive + "/" + styleName + ".css";
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getHorizontalDirectiveDataPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getHorizontalDirectiveDataPath: function (directive, jsonName){
            return horizontalPathDiretive + directive + "/" + jsonName + ((environment.packed)?".min":"") + ".json";
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getModalTplPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        //TODO refactor to attributes set template
        getModalTplPath: function (action) {
            var tpl;
            switch (action) {
                case "retirementAge":
                    tpl = verticalPath + "issue/partials/historical/retirementAge.html";
                    break;
                case "olderWorkers":
                    tpl = verticalPath + "issue/partials/historical/olderWorkers.html";
                    break;
                case "HLYvsLE":
                    tpl = verticalPath + "issue/partials/historical/HLYvsLE.html";
                    break;
                case "maximize":
                    tpl = horizontalPathDiretive + "graphic/maximize/" + action + ".html";
                    break;
                case "maximizeRadar":
                    tpl = horizontalPathDiretive + "graphic/maximize/" + action + ".html";
                    break;
                case "maximizePyramid":
                    tpl = horizontalPathDiretive + "graphic/maximize/" + action + ".html";
                    break;
                default:
                    tpl = null;
            }
            console.log("Graphic context menu action template: " + tpl);
            return tpl;
        },

        // ----------------------------------
        //  CDA access
        // ----------------------------------

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getDataPilotPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getDataPilotPath:function() {
            return dataPath + configuration.paths.data.cda.datapilot;
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getPilotDataPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getPilotDataPath:function() {
            return dataPath + configuration.paths.data.cda.datapilot;
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getPolicyDataPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getPolicyDataPath:function() {
            return dataPath + configuration.paths.data.cda.policies;
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getAPDataPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getAPDataPath:function() {
            return  dataPath + configuration.paths.data.cda.approach;
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getCountriesDataPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getCountriesDataPath:function() {
            return dataPath + configuration.paths.data.cda.countryCard;
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getIssueDataPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getIssueDataPath:function() {
            return dataPath + configuration.paths.data.cda.issue;
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getIssueDataPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getIssueHistoricalDataPath:function() {
            return dataPath + configuration.paths.data.cda.issueHistorical;
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getIssueDataPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getGlossaryDataPath:function() {
            return dataPath + configuration.paths.data.cda.glossary;
        },


        // ----------------------------------
        //  piwik
        // ----------------------------------

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getPiwikPath
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getPiwikPath: function () {
            return configuration.paths.piwik[environment.piwik].protocol + ":"
                + configuration.paths.piwik[environment.piwik].domain
                + ":" + configuration.paths.piwik[environment.piwik].port
                + configuration.paths.piwik[environment.piwik].path + 'piwik.js';
        },

        /**
         * @ngdoc method
         * @name dvt.configModule.configService#getPiwikInstance
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        getPiwikInstance: _getPiwikInstance,
        /**
         * @ngdoc method
         * @name dvt.configModule.configService#activateDesactivatePiwik
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */


        tooglePiwik: function (val) {
            if(val==true) { //desactiva pikiw
                //environment.do_track=true;
                window._paq =  [];
            } else {
                window._paq = _getPiwikInstance;
            }
        },
        /**
         * @ngdoc method
         * @name dvt.configModule.configService#dynamicallyRegisterController
         * @param {string} carl is awesome
         * @methodOf dvt.configModule.configService
         * @description
         * My Description rules
         */
        dynamicallyRegisterController: function ($controllerProvider, path, module, controllerName) {
            return {
                myCtrl: ['$q',function ($q) {
                    var defer = $q.defer();
                    require([path], function(ctrl) {
                        $controllerProvider.register(controllerName, ctrl);
                        defer.resolve();
                    });
                    return defer.promise;
                }]
            };
        },
        isIE: function(){
            if (navigator.appName == 'Microsoft Internet Explorer' ||  !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/)))
            {
                return true
            }
            return false
        },
        isMobile: function(){
            if(navigator.userAgent.match('iPhone') ||
                navigator.userAgent.match('iPad') ||
                navigator.userAgent.match('iPod') ||
                navigator.userAgent.match('Android') ||
                navigator.userAgent.match('IEMobile') ||
                navigator.userAgent.match('Opera Mini')) {
                return true
            } else {
                return false
            }
        }
        
    };
});