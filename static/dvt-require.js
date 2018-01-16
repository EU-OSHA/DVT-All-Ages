/*!
 * Copyright 2015 - 2016 Zylk.net. All rights reserved.
 *
 * This software was developed by Zylk.net and is provided under the terms
 * of ****, Version ***, or any later version. You may not use
 * this file except in compliance with the license. If you need a copy of the license,
 * please go to *********************. The Initial Developer is Zylk.net.
 *
 * Software distributed under the ******* License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. Please refer to
 * the license for the specific language governing your rights and limitations.
 */

(function () {
    /*if (null === requireCfg){ var requireCfg = {waitSeconds: 30, paths: {}, shim: {}, map: {"*": {}}, bundles: {}, config: {service: {}}, packages: []};}*/

    var requirePaths = requireCfg['paths'];
    var requireConfig = requireCfg['config'];
    var amdShim = requireConfig['amd']['shim'];
    var shim = requireCfg['shim'];
    var systemPath = CONTEXT_PATH + 'plugin/pentaho-cdf-dd/api/resources/system';
    var staticCustom = CONTEXT_PATH + 'plugin/pentaho-cdf-dd/api/resources/system/all-ages/static/custom';
    var componentsPath = CONTEXT_PATH + 'plugin/pentaho-cdf-dd/api/resources/system/all-ages/static/system/components';
    var horizontalModules = CONTEXT_PATH + 'plugin/pentaho-cdf-dd/api/resources/system/all-ages/static/custom/modules/horizontal';
    var verticalModules = CONTEXT_PATH + 'plugin/pentaho-cdf-dd/api/resources/system/all-ages/static/custom/modules/vertical';


    /*
     * if you want to debug just put ?isDebug=true&debugLevel=5 in browser params
     */
    var isDebug = typeof document == "undefined" || document.location.href.indexOf("debug=true") > 0 || environment.packed === false;
    console.log('debug: ' + isDebug);
    var suffix = (isDebug) ? "" : ".min";


    //requireCfg.urlArgs = "ts=" + (new Date()).getTime();
    requireCfg.urlArgs = "";


    /* OPTIMIZATION */

    requirePaths["common-ui/angular"] = componentsPath + "/angular/angular" + suffix;
    // requirePaths["common-ui/angular-ui-bootstrap"] = componentsPath + "/angular-bootstrap/ui-bootstrap-tpls.min";
    // shim["common-ui/angular-ui-bootstrap"] = ["common-ui/angular"];

    requirePaths["horizontal/templates"] = horizontalModules + '/templates';
    shim['horizontal/templates'] = ['common-ui/angular'];
    requirePaths["vertical/templates"] = verticalModules + '/templates';
    shim['vertical/templates'] = ['common-ui/angular'];

    /* LIBRARIES */

    requirePaths['common-ui/angular-ui-router'] = componentsPath + '/angular-ui-router/release/angular-ui-router.min';
    shim['common-ui/angular-ui-router'] = ['common-ui/angular'];

    requirePaths['dvt/angulartics'] = componentsPath + '/angulartics/dist/angulartics.min';
    shim['dvt/angulartics'] = ["common-ui/angular", "common-ui/angular-ui-router"];
    requirePaths['dvt/angulartics-piwik'] = componentsPath + '/angulartics/dist/angulartics-piwik.min';
    shim['dvt/angulartics-piwik'] = ["common-ui/angular", "common-ui/angular-ui-router"];

    requirePaths['common-ui/angular-jquery'] = componentsPath + '/angular-jquery/dist/angular-jquery' + suffix;
    shim['common-ui/angular-jquery'] = ["common-ui/angular", "common-ui/angular-ui-router"];

    requirePaths['common-ui/angular-bootstrap-affix'] = componentsPath +  '/angular-bootstrap-affix/dist/angular-bootstrap-affix' + suffix;
    shim['common-ui/angular-bootstrap-affix'] = ["common-ui/angular", "common-ui/angular-ui-router", "common-ui/angular-jquery"];

    requirePaths['dvt/directives/scroll'] = componentsPath + '/angular-scroll/angular-scroll' + suffix;
    shim['dvt/directives/scroll'] = ["common-ui/angular", "common-ui/angular-ui-router"];

    requirePaths['dvt/directives/tooltip'] = componentsPath + '/angular-tooltips/dist/angular-tooltips' + suffix;
    shim['dvt/directives/tooltip'] = ["common-ui/angular"];

    requirePaths['dvt/directives/angular-cookies'] = componentsPath + '/angular-cookies/angular-cookies'+ suffix;
    shim['dvt/directives/angular-cookies'] = ['common-ui/angular'];

    requirePaths['dvt/directives/angular-consent'] = componentsPath + '/angular-consent/dist/angular-consent'+ suffix;
    shim['dvt/directives/angular-consent'] = ['common-ui/angular','dvt/directives/angular-cookies'];

    requirePaths['common-ui/angularjs-socialshare'] = componentsPath + '/angularjs-socialshare/dist/angular-socialshare' + suffix;
    shim['common-ui/angularjs-socialshare'] = ["common-ui/angular"];


    // =====================
    //  3rd party libraries
    // =====================
    if (isDebug){
        requirePaths['common-exporting/dom-to-image'] = componentsPath + '/dom-to-image/src/dom-to-image';
    }else{
       requirePaths['common-exporting/dom-to-image'] = componentsPath + '/dom-to-image/dist/dom-to-image.min';
    }

    // exporting
    requirePaths['common-exporting/html2canvas'] = componentsPath  + '/html2canvas/dist/html2canvas' + suffix;
    requirePaths['common-exporting/file-saver'] = componentsPath + '/file-saver/FileSaver' + suffix;

    /* HORIZONTAL ****************************************************************/

    /* CONFIG */
    requirePaths['horizontal/config/config-module'] = horizontalModules + '/config/config-module' + suffix;
    requirePaths['horizontal/config/configService'] = horizontalModules + '/config/configService' + suffix;
    requirePaths['horizontal/config/configuration'] = horizontalModules + '/config/configuration' + suffix + '.json';
    requirePaths['horizontal/config/environment'] = horizontalModules + '/config/environment' + suffix + '.json';

    /* SERVICES */
    /* DATA */
    requirePaths['horizontal/services/dataService'] = horizontalModules + '/services/DataService' + suffix;
    /* UTILS */
    requirePaths['horizontal/services/utils'] = horizontalModules + '/services/Utils' + suffix;
    /* CHARTING */
    requirePaths['horizontal/services/mapProvider'] = horizontalModules + '/services/MapProvider' + suffix;
    requirePaths['horizontal/services/plotsProvider'] = horizontalModules + '/services/PlotsProvider' + suffix;
    /* ACTIONS */
    requirePaths['horizontal/graphic/services/exportService'] = horizontalModules + '/directives/graphic/services/ExportService' + suffix;
    requirePaths['horizontal/graphic/services/maximizeService'] = horizontalModules + '/directives/graphic/services/MaximizeService' + suffix;

    /* MODEL */
    /* COLORS */
    requirePaths['horizontal/model/colors'] = horizontalModules + '/model/Colors' + suffix + '.json';

    /* DIRECTIVES */
    requirePaths['horizontal/directives/directives-module'] = horizontalModules + '/directives/directives-module' + suffix;
    requirePaths['horizontal/directives/charting-module'] = horizontalModules + '/directives/charting-module' + suffix;

    requirePaths['dvt/directives/dashboard'] = horizontalModules + '/directives/dashboard/ZylkDashboardDirective' + suffix;
    requirePaths['dvt/directives/select'] = horizontalModules + '/directives/select/ZylkSelectDirective' + suffix;
    requirePaths['dvt/directives/radio'] = horizontalModules + '/directives/radio/ZylkRadioDirective' + suffix;
    requirePaths['dvt/directives/search'] = horizontalModules + '/directives/search/dvtSearchDirective' + suffix;
    requirePaths['horizontal/search/i18n'] = horizontalModules + '/directives/search/search-i18n' + suffix + '.json';
    requirePaths['dvt/directives/social'] = horizontalModules + '/directives/social/ZylkSocialDirective' + suffix;
    requirePaths['dvt/directives/header'] = horizontalModules + '/directives/header/ZylkHeaderDirective' + suffix;
    requirePaths['dvt/directives/footer'] = horizontalModules + '/directives/footer/ZylkFooterDirective' + suffix;
    requirePaths['dvt/directives/main-menu'] = horizontalModules + '/directives/main-menu/ZylkMainMenuDirective' + suffix;
    requirePaths['dvt/directives/breadcrumb-items'] = horizontalModules + '/directives/main-menu/breadcrumb' + suffix + '.json';
    requirePaths['dvt/directives/title-items'] = horizontalModules + '/directives/main-menu/titles' + suffix + '.json';


    /* CUSTOM CHARTS */
    requirePaths['dvt/directives/barchart'] = horizontalModules + '/directives/graphic/ZylkBarChartDirective' + suffix;
    requirePaths['dvt/directives/pyramidchart'] = horizontalModules + '/directives/graphic/ZylkPyramidChartDirective' + suffix;
    requirePaths['dvt/graphic/MaximizeController'] = horizontalModules + '/directives/graphic/maximize/MaximizeController' + suffix;
    requirePaths['dvt/graphic/HistoricalController'] = horizontalModules + '/directives/graphic/historical/HistoricalController' + suffix;
    requirePaths['dvt/graphic/legendDescription'] = horizontalModules + '/directives/graphic/i18n/LD-i18n' + suffix + '.json';

    requirePaths['dvt/directives/radar'] = horizontalModules + '/directives/graphic/ZylkRadarChartDirective' + suffix;
    requirePaths['dvt/directives/map'] = horizontalModules + '/directives/map/ZylkShapeDirective' + suffix;

    requirePaths['dvt/directives/paging'] = horizontalModules + '/directives/paging/paging' + suffix;
    requirePaths['dvt/cookies-disclaimer/CookiesController'] = horizontalModules + '/includes/general/CookiesController' + suffix;
    requirePaths['dvt/translate/TranslateController'] = horizontalModules + '/includes/general/TranslateController' + suffix;

    /* VERTICAL *****************************************************************/

    /* HOME */
    requirePaths['vertical/home/home-module'] = verticalModules + '/home/home-module' + suffix;
    requirePaths['vertical/home/HomeController'] = verticalModules + '/home/HomeController' + suffix;
    requirePaths['vertical/home/range'] = verticalModules + '/home/directives/ZylkRangeDirective' + suffix;
    requirePaths['vertical/home/i18n'] = verticalModules + '/home/HP-i18n' + suffix + '.json';


    /* ISSUE */
    requirePaths['vertical/issue/issue-module'] = verticalModules + '/issue/issue-module' + suffix;
    requirePaths['vertical/issue/IssueController'] = verticalModules + '/issue/IssueController' + suffix;

    requirePaths['vertical/issue/i18n'] = verticalModules + '/issue/IS-i18n' + suffix + '.json';
    requirePaths['vertical/issue/service'] = verticalModules + '/issue/services/IssueService' + suffix;
    requirePaths['vertical/issue/ZylkMenuIssueDirective'] = verticalModules + '/issue/directives/menu-issue/ZylkMenuIssueDirective' + suffix;
    requirePaths['vertical/issue/menu/menu-items'] = verticalModules + '/issue/directives/menu-issue/menu' + suffix + '.json';

    /* APPROACHES */
    requirePaths['vertical/approaches/policies-module'] = verticalModules + '/policies/policies-module' + suffix;

    /* APPROACHES */
    requirePaths['vertical/approaches/ApproachesController'] = verticalModules + '/policies/approaches/ApproachesController' + suffix;
    requirePaths['vertical/services/approachService'] = verticalModules + '/policies/approaches/services/ApproachService' + suffix;
    requirePaths['vertical/approaches/ZkMainIndicatorDirective'] = verticalModules + '/policies/approaches/ZylkEnlargeIndicatorDirective' + suffix;
    requirePaths['vertical/approaches/i18n'] = verticalModules + '/policies/approaches/CA-i18n' + suffix + '.json';

    /* POLICY  */
    requirePaths['vertical/policy/policy-module'] = verticalModules + '/policy/policy-module' + suffix;
    requirePaths['vertical/policy/PolicyController'] = verticalModules + '/policies/policy/PolicyController' + suffix;
    requirePaths['vertical/policy/i18n'] = verticalModules + '/policies/policy/PL-i18n' + suffix + '.json';

    /* COUNTRIES */
    requirePaths['vertical/countries/countries-module'] = verticalModules + '/countries/countries-module' + suffix;
    requirePaths['vertical/countries/CSPController'] = verticalModules + '/countries/csp/CSPController' + suffix;
    requirePaths['vertical/countries/CountriesController'] = verticalModules + '/countries/CountriesController' + suffix;
    requirePaths['vertical/services/countriesService'] = verticalModules + '/countries/country-insight/services/CountriesService' + suffix;
    requirePaths['vertical/countries/directives/menu'] = verticalModules + '/countries/country-insight/ZylkCountryMenuDirective' + suffix;
    requirePaths['vertical/countries/directives/anchor'] = verticalModules + '/countries/country-insight/ZylkCountryAnchorDirective' + suffix;
    requirePaths['vertical/country-card/anchor-items'] = verticalModules + '/countries/country-insight/country-card/anchor' + suffix + '.json';
    requirePaths['vertical/country-comparison/anchor-items'] = verticalModules + '/countries/country-insight/country-comparison/anchor' + suffix + '.json';
    requirePaths['vertical/countries/directives/select-redirect'] = verticalModules + '/countries/country-insight/country-card/ZylkCountryCardSelectRedirectDirective' + suffix;
    requirePaths['vertical/countries/directives/section'] = verticalModules + '/countries/country-insight/ZylkCountrySectionDirective' + suffix;
    requirePaths['vertical/countries/i18n'] = verticalModules + '/countries/country-insight/C-i18n' + suffix + '.json';

    /* ADDITIONAL RESOURCES */
    requirePaths['vertical/countries/AdditionalResourcesController'] = verticalModules + '/countries/additional-resources/AdditionalResourcesController' + suffix;
    requirePaths['vertical/additional-resources/AR-i18n'] = verticalModules + '/countries/additional-resources/AR-i18n' + suffix + '.json';

    /* CSP Country panel */
    requirePaths['vertical/countries/directives/panel'] = verticalModules + '/countries/csp/ZylkCountryCSPPanelDirective' + suffix;
    requirePaths['vertical/csp/i18n'] = verticalModules + '/countries/csp/CSP-i18n' + suffix + '.json';

    /* METHODOLOGY */
    requirePaths['vertical/methodology/methodology-module'] = verticalModules + '/methodology/methodology-module' + suffix;
    requirePaths['vertical/methodology/MethodologyController'] = verticalModules + '/methodology/MethodologyController' + suffix;
    requirePaths['vertical/methodology/i18n'] = verticalModules + '/methodology/M-i18n' + suffix + '.json';

    /* GLOSSARY */
    requirePaths['vertical/glossary/glossary-module'] = verticalModules + '/glossary/glossary-module' + suffix;
    requirePaths['vertical/glossary/GlossaryController'] = verticalModules + '/glossary/GlossaryController' + suffix;

    /* FOOTER */
    requirePaths['vertical/footer-pages/footer-pages-module'] = verticalModules + '/footer-pages/footer-pages-module' + suffix;
    requirePaths['vertical/footer-pages/FooterPagesController'] = verticalModules + '/footer-pages/FooterPagesController' + suffix;
    requirePaths['vertical/footer-pages/i18n'] = verticalModules + '/footer-pages/FP-i18n' + suffix + '.json';

    requireCfg['deps'] = [staticCustom + '/app' + suffix + '.js'];

    require.config(requireCfg);
})();