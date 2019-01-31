'use strict';

/*
 * Depedencies
 */
var fs = require('fs'),
    gulp = require('gulp'),
    angularTemplateCache = require('gulp-angular-templatecache'),
    bower = require('gulp-bower'),
    clean = require('gulp-clean'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    debug = require('gulp-debug'),
    htmlmin = require('gulp-htmlmin'),
    jsonMinify = require('gulp-json-minify'),
    /* jsonSass = require('gulp-json-sass'),*/
    gulpif = require('gulp-if'),
    livereload = require('gulp-livereload'),
    minify = require('gulp-minify'),
    gulpDocs = require('gulp-ngdocs'),
    open = require('gulp-open'),
    rename = require("gulp-rename"),
    sass = require('gulp-sass'),
    phantom = require('gulp-phantom'),
    replace = require('gulp-replace'),
    shell = require("gulp-shell"),
    gutil = require('gulp-util');


function getArg(key) {
    var index = process.argv.indexOf(key);
    var next = process.argv[index + 1];
    return (index < 0) ? null : (!next || next[0] === "-") ? true : next;
}

var pentaho = getArg("--pentaho");
var piwik = getArg("--piwik");
var do_track = getArg("--do_track");
var packed = getArg("--packed");
var documentation = getArg("--documentation");
var seo = getArg("--seo");
var cache = getArg("--cache");

// Default Task
gulp.task('default', ['bower', 'bootstrap-sass', 'dvt-sass', 'setup-environment', 'clean-min', 'package', 'html-horizontal-templates', 'html-vertical-templates']);

//gulp.task('json-sass', function() {
//    return gulp.src('./static/custom/modules/horizontal/model/Colors.json')
//        .pipe(jsonSass({
//            sass: true
//        }))
//        .pipe(gulp.dest('./static/custom/scss/colors/'));
//});

gulp.task('dvt-sass', function () {
    return gulp.src('static/custom/scss/allages.scss')
        .pipe(sass().on('error', sass.logError))
        //.pipe(cleanCSS({compatibility: ''}))
        .pipe(concat('app.css'))
        .pipe(gulp.dest('static/custom/css'))
        .pipe(livereload());

});

gulp.task('dvt-sass:watch', function () {
    livereload.listen();
    gulp.watch('./**/*.scss', ['dvt-sass']);
});

gulp.task('bootstrap-sass', function () {
    return gulp.src('static/custom/scss/bootstrap-dvt-variables.scss')
        .pipe(sass().on('error', sass.logError))
        //.pipe(cleanCSS({compatibility: ''}))
        .pipe(concat('bootstrap-dvt.css'))
        .pipe(gulp.dest('static/custom/css'))
        .pipe(livereload());

});

gulp.task('ci-environment', function () {
    gulp.src(['./static/custom/modules/horizontal/config/environment.json'])
        .pipe(replace(/\"pentaho\":(.*?),/g, '"pentaho": "' + pentaho + '",'))
        .pipe(replace(/\"piwik\":(.*?),/g, '"piwik": "' + piwik + '",'))
        .pipe(replace(/\"do_track\":(.*?),/g, '"do_track": ' + do_track + ','))
        .pipe(replace(/\"packed\":(.*?)\n/g, '"packed": ' + packed ))
        .pipe(gulp.dest(function(file) {
            return file.base;
        }));

    console.log("pentaho:" + pentaho
        + " piwik:" + piwik
        + " do_track:" + do_track
        + " packed:" + packed
        + " seo:" + seo);
});

gulp.task('setup-environment', function () {

    var raw = new String(fs.readFileSync('./static/custom/modules/horizontal/config/environment.json'));
    var configuration = new String(fs.readFileSync('./static/custom/modules/horizontal/config/configuration.json'));
    configuration = JSON.parse(configuration);
    var environment = JSON.parse(raw);
    var piwik = configuration.paths.piwik[environment.piwik].protocol + ":" +  configuration.paths.piwik[environment.piwik].domain + ":" + configuration.paths.piwik[environment.piwik].port + configuration.paths.piwik[environment.piwik].path + 'piwik.js';

    /* Expresiones regulares para:
     *   - Eliminar las comillas en las claves
     *   - Concatenar en una linea
     *   - Eliminar espacios
     */

    raw = raw.replace(/\"([^(\")"]+)\":/g,"$1:").replace(/\n/g, "").replace(/\s/g, "");
    gulp.src(['./resources/styles/cpk.html'])
        .pipe(replace(/window.environment = \{(.*?)\};/g, 'window.environment = ' + raw + ';'))
        .pipe(replace(/id=\"pathPiwik\" src=\"(.*?)\"/g, 'id="pathPiwik" src="' + piwik + '"'))
        .pipe(gulp.dest(function(file) {
            return file.base;
        }));
});

gulp.task('html-horizontal-templates', function () {
    var options = {
        root: '/pentaho/plugin/pentaho-cdf-dd/api/resources/system/all-ages/static/custom/modules/horizontal/',
        module: 'horizontalTemplatesModule',
        filename: "templates.js",
        standalone: true,
        htmlmin: true,
        templateHeader: "define(function (require) { 'use strict'; var angular = require('common-ui/angular'); return angular.module('<%= module %>'<%= standalone %>).run(['$templateCache', function($templateCache) {",
        templateFooter: "}]); });"
    };

    gulp.src('./static/custom/modules/horizontal/**/*.html')
        .pipe(gulpif((packed === 'true'), debug({title: 'File:'})))
        .pipe(gulpif((packed === 'true'), angularTemplateCache(options)))
        .pipe(gulpif((packed === 'true'), debug({title: 'File:'})))
        .pipe(gulpif((packed === 'true'), gulp.dest('./static/custom/modules/horizontal/')));
});

gulp.task('html-vertical-templates', function () {
    var options = {
        root: '/pentaho/plugin/pentaho-cdf-dd/api/resources/system/all-ages/static/custom/modules/vertical/',
        module: '',
        filename: "templates.js",
        htmlmin: true,
        templateHeader: "define(function (require) { 'use strict'; var angular = require('common-ui/angular');",
        templateBody: "angular.module('"
        + "<%= url.replace('/pentaho/plugin/pentaho-cdf-dd/api/resources/system/all-ages/static/custom/modules/vertical/','').replace(/\\/(.*?).html/g, '') %>'"
        + ").run(['$templateCache', function($templateCache) { $templateCache.put('<%= url %>','<%= contents %>'); }]);",
        templateFooter: "});"
    };

    gulp.src('./static/custom/modules/vertical/**/*.html')
        .pipe(gulpif((packed === 'true'), debug({title: 'File:'})))
        .pipe(gulpif((packed === 'true'), angularTemplateCache(options)))
        .pipe(gulpif((packed === 'true'), debug({title: 'File:'})))
        .pipe(gulpif((packed === 'true'), gulp.dest('./static/custom/modules/vertical/')));
});

gulp.task('documentation', [], function () {

    var options = {
        scripts: [],
        styles: ["./build-res/dvt-documentation-styles.css"],
        html5Mode: true,
        startPage: '/api/dvt',
        title: "All-ages",
        image: "./static/custom/img/EU-OSHA-en.png",
        imageLink: "/all-ages/resources-ext/documentation/api",
        titleLink: "/all-ages/resources-ext/documentation/api"
    };

    return gulp.src(['README.md', './static/custom/modules/**/*.js'])
        .pipe(gulpif((documentation === 'true'), gulpDocs.process(options)))
        .pipe(gulpif((documentation === 'true'), gulp.dest('./resources-ext/documentation')))
        .pipe(gulpif((documentation === 'true'), connect.reload()));
});

gulp.task('documentation:watch', function () {
    livereload.listen();
    gulp.watch('./static/custom/modules/**/*.js', ['documentation']);
});

gulp.task('documentation_connect', function () {
    connect.server({
        root: 'resources-ext/documentation',
        port: 8083,
        livereload: true
    });

    gulp.src(__filename).pipe(open({uri: 'http://localhost:8083'}));

});

gulp.task('package', function () {

    gulp.src('./static/custom/modules/**/*.js')
        .pipe(gulpif((packed === 'true'),
            minify({
                ext: {
                    src:'.js',
                    min:'.min.js'
                },
                exclude: [],
                ignoreFiles: ['*.min.js', '.json'],
                mangle: false
            })))
        .on('error', gutil.log)
        .pipe(gulpif((packed === 'true'), debug({title: 'File:'})))
        .pipe(gulpif((packed === 'true'), gulp.dest('./static/custom/modules/')));

    gulp.src('./static/custom/app.js')
        .pipe(gulpif((packed === 'true'),
            minify({
                ext: {
                    src:'.js',
                    min:'.min.js'
                },
                exclude: [],
                ignoreFiles: ['*.min.js', '.json'],
                mangle: false
            })))
        .pipe(gulpif((packed === 'true'), debug({title: 'File:'})))
        .pipe(gulpif((packed === 'true'), gulp.dest('./static/custom/')));

    gulp.src('./static/custom/modules/**/*.html')
        .pipe(gulpif((packed === 'true'), htmlmin(
            {
                collapseWhitespace: true,
                caseSensitive: true,
                ignoreCustomComments: true
            }
        )))
        .pipe(gulpif((packed === 'true'), rename({
            suffix: ".min"
        })))
        .pipe(gulpif((packed === 'true'), gulp.dest('./static/custom/modules/')));


    gulp.src('./static/custom/modules/**/*.json')
        .pipe(gulpif((packed === 'true'), jsonMinify()))
        .pipe(gulpif((packed === 'true'), rename({
            suffix: ".min"
        })))
        .pipe(gulpif((packed === 'true'), gulp.dest('./static/custom/modules/')));

});


gulp.task('cache', function () {
    gulp.src(['./settings.xml'])
        .pipe(gulpif(cache === 'true', replace(/<cache>(.*?)<\/cache>/g, '<cache>true</cache>')))
        .pipe(gulpif(cache === 'true', replace(/<max-age>(.*?)<\/max-age>/g, '<max-age>604800</max-age>')))
        .pipe(gulpif(cache === 'true', replace(/<cache-messages>(.*?)<\/cache-messages>/g, '<cache-messages>true</cache-messages>')))

        .pipe(gulpif((cache === 'false'), replace(/<cache>(.*?)<\/cache>/g, '<cache>false</cache>')))
        .pipe(gulpif((cache === 'false'), replace(/<max-age>(.*?)<\/max-age>/g, '<max-age>0</max-age>')))
        .pipe(gulpif((cache === 'false'), replace(/<cache-messages>(.*?)<\/cache-messages>/g, '<cache-messages>false</cache-messages>')))

        .pipe(gulp.dest(function(file) {
            return file.base;
        }));
});

gulp.task('performance', function () {

    gulp.src('./build-res/sitemap.xml', {read: false})
    //TODO AUTOMATIZE PARSE THE SITEMAP URLS
        .pipe(gulpif((seo === 'true'), shell([
            'phantomjs --web-security=no ./build-res/performance.js  http://osha-bi.zylk.net:8081/#!/ home.html'
            // 'phantomjs --web-security=no ./build-res/performance.js  http://osha-bi.zylk.net:8081/#!/issue issue.html',
            // 'phantomjs --web-security=no ./build-res/performance.js  http://osha-bi.zylk.net:8081/#!/approaches-map approaches-map.html',
            // 'phantomjs --web-security=no ./build-res/performance.js  http://osha-bi.zylk.net:8081/#!/policy policy.html',
            // 'phantomjs --web-security=no ./build-res/performance.js  http://osha-bi.zylk.net:8081/#!/countries-selection-panel countries-selection-panel.html',
            // 'phantomjs --web-security=no ./build-res/performance.js  http://osha-bi.zylk.net:8081/#!/country-card/ country-card.html',
            // 'phantomjs --web-security=no ./build-res/performance.js  http://osha-bi.zylk.net:8081/#!/country-comparison/ country-comparison.html',
            // 'phantomjs --web-security=no ./build-res/performance.js  http://osha-bi.zylk.net:8081/#!/methodology methodology.html',
            // 'phantomjs --web-security=no ./build-res/performance.js  http://osha-bi.zylk.net:8081/#!/additional-resources additional-resources.html',
            // 'phantomjs --web-security=no ./build-res/performance.js  http://osha-bi.zylk.net:8081/#!/glossary glossary.html',
            // 'phantomjs --web-security=no ./build-res/performance.js  http://osha-bi.zylk.net:8081/#!/site-map site-map.html',
            // 'phantomjs --web-security=no ./build-res/performance.js  http://osha-bi.zylk.net:8081/#!/accessibility accessibility.html',
            // 'phantomjs --web-security=no ./build-res/performance.js  http://osha-bi.zylk.net:8081/#!/privacy-policy privacy-policy.html',
            // 'phantomjs --web-security=no ./build-res/performance.js  http://osha-bi.zylk.net:8081/#!/legal-notice legal-notice.html'
        ], {
            templateData: {
                f: function (s) {
                    return s.replace(/$/, '.bak')
                }
            }
        }).on('error', gutil.log)))
        .on('error', gutil.log);
        //.pipe(gulpif((seo === 'true'), gulp.dest('./build-res/snapshots/')));

});



/*
 * to be replaced
 * ej:
 *
 * https://visualisation.osha.europa.eu
 */
gulp.task('seo', function () {
    var pages = new String(fs.readFileSync('./static/custom/seo/pages_title_description.json'));
    pages = JSON.parse(pages);

    gulp.src('./static/custom/seo/sitemap.xml', {read: false})
    //TODO AUTOMATIZE PARSE THE SITEMAP URLS
        .pipe(gulpif((seo === 'true'), shell([
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/ home.html "' + pages.home.title + '" "' + pages.home.description+'"',

            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/key-issue/early-exit-labour-market key-issue_early-exit-labour-market.html  "'+ pages.key_issue_early_exit_labour_market.title + '" "' + pages.key_issue_early_exit_labour_market.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/key-issue/labour-market-participation key-issue_labour-market-participation.html "'+ pages.key_issue_labour_market_participation.title + '" "' + pages.key_issue_labour_market_participation.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/key-issue/impact-work-health key-issue_impact-work-health.html "'+ pages.key_issue_impact_work_health.title + '" "' + pages.key_issue_impact_work_health.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/key-issue/health-inequalities key-issue_health-inequalities.html "'+ pages.key_issue_health_inequalities.title + '" "' + pages.key_issue_health_inequalities.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/key-issue/working-conditions key-issue_working-conditions.html "'+ pages.key_issue_working_conditions.title + '" "' + pages.key_issue_working_conditions.description+'"',

            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-groups/group1/description country-groups_group1_description.html "'+ pages.country_groups_group1_description.title + '" "' + pages.country_groups_group1_description.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-groups/group1/policies-iniciatives country-groups_group1_policies-iniciatives.html "'+ pages.country_groups_group1_policies_policies_iniciatives.title + '" "' + pages.country_groups_group1_policies_policies_iniciatives.description+'"',

            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-groups/group2/description country-groups_group2_description.html "'+ pages.country_groups_group2_description.title + '" "' + pages.country_groups_group2_description.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-groups/group2/policies-iniciatives country-groups_group2_policies-iniciatives.html "'+ pages.country_groups_group2_policies_iniciatives.title + '" "' + pages.country_groups_group2_policies_iniciatives.description+'"',

            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-groups/group3/description country-groups_group3_description.html "'+ pages.country_groups_group3_description.title + '" "' + pages.country_groups_group3_description.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-groups/group3/policies-iniciatives country-groups_group3_policies-iniciatives.html "'+ pages.country_groups_group3_policies_iniciatives.title + '" "' + pages.country_groups_group3_policies_iniciatives.description+'"',

            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-groups/group4/description country-groups_group4_description.html "'+ pages.country_groups_group4_description.title + '" "' + pages.country_groups_group4_description.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-groups/group4/policies-iniciatives country-groups_group4_policies-iniciatives.html "'+ pages.country_groups_group4_policies_iniciatives.title + '" "' + pages.country_groups_group4_policies_iniciatives.description+'"',

            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/policies-strategies-programmes policies-strategies-programmes.html "'+ pages.policies_strategies_programmes.title + '" "' + pages.policies_strategies_programmes.description+'"',

            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-profiles country-profiles.html "'+ pages.country_profiles.title + '" "' + pages.country_profiles.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/AT country-card_AT.html "'+ pages.country_card_AT.title + '" "' + pages.country_card_AT.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/BE country-card_BE.html "'+ pages.country_card_BE.title + '" "' + pages.country_card_BE.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/BG country-card_BG.html "'+ pages.country_card_BG.title + '" "' + pages.country_card_BG.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/HR country-card_HR.html "'+ pages.country_card_HR.title + '" "' + pages.country_card_HR.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/CY country-card_CY.html "'+ pages.country_card_CY.title + '" "' + pages.country_card_CY.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/CZ country-card_CZ.html "'+ pages.country_card_CZ.title + '" "' + pages.country_card_CZ.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/DK country-card_DK.html "'+ pages.country_card_DK.title + '" "' + pages.country_card_DK.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/EE country-card_EE.html "'+ pages.country_card_EE.title + '" "' + pages.country_card_EE.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/FI country-card_FI.html "'+ pages.country_card_FI.title + '" "' + pages.country_card_FI.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/FR country-card_FR.html "'+ pages.country_card_FR.title + '" "' + pages.country_card_FR.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/DE country-card_DE.html "'+ pages.country_card_DE.title + '" "' + pages.country_card_DE.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/GR country-card_GR.html "'+ pages.country_card_GR.title + '" "' + pages.country_card_GR.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/HU country-card_HU.html "'+ pages.country_card_HU.title + '" "' + pages.country_card_HU.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/IS country-card_IS.html "'+ pages.country_card_IS.title + '" "' + pages.country_card_IS.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/IE country-card_IE.html "'+ pages.country_card_IE.title + '" "' + pages.country_card_IE.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/IT country-card_IT.html "'+ pages.country_card_IT.title + '" "' + pages.country_card_IT.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/LV country-card_LV.html "'+ pages.country_card_LV.title + '" "' + pages.country_card_LV.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/LT country-card_LT.html "'+ pages.country_card_LT.title + '" "' + pages.country_card_LT.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/LU country-card_LU.html "'+ pages.country_card_LU.title + '" "' + pages.country_card_LU.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/MT country-card_MT.html "'+ pages.country_card_MT.title + '" "' + pages.country_card_MT.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/NL country-card_NL.html "'+ pages.country_card_NL.title + '" "' + pages.country_card_NL.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/NO country-card_NO.html "'+ pages.country_card_NO.title + '" "' + pages.country_card_NO.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/PL country-card_PL.html "'+ pages.country_card_PL.title + '" "' + pages.country_card_PL.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/PT country-card_PT.html "'+ pages.country_card_PT.title + '" "' + pages.country_card_PT.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/RO country-card_RO.html "'+ pages.country_card_RO.title + '" "' + pages.country_card_RO.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/SK country-card_SK.html "'+ pages.country_card_SK.title + '" "' + pages.country_card_SK.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/SI country-card_SI.html "'+ pages.country_card_SI.title + '" "' + pages.country_card_SI.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/ES country-card_ES.html "'+ pages.country_card_ES.title + '" "' + pages.country_card_ES.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/SE country-card_SE.html "'+ pages.country_card_SE.title + '" "' + pages.country_card_SE.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/CH country-card_CH.html "'+ pages.country_card_CH.title + '" "' + pages.country_card_CH.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/country-card/GB country-card_GB.html "'+ pages.country_card_GB.title + '" "' + pages.country_card_GB.description+'"',

            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/infographics infographics.html "'+ pages.infographics.title + '" "' + pages.infographics.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/about-tool about-tool.html "'+ pages.about_tool.title + '" "' + pages.about_tool.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/glossary glossary.html "'+ pages.glossary.title + '" "' + pages.glossary.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/site-map site-map.html "'+ pages.site_map.title + '" "' + pages.site_map.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/accessibility accessibility.html "'+ pages.accessibility.title + '" "' + pages.accessibility.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/privacy-policy privacy-policy.html "'+ pages.privacy_policy.title + '" "' + pages.privacy_policy.description+'"',
            'phantomjs --ignore-ssl-errors=yes ./build-res/seo_getSnapshot.js  https://visualisation.osha.europa.eu/ageing-and-osh#!/legal-notice legal-notice.html "'+ pages.legal_notice.title + '" "' + pages.legal_notice.description+'"'
        ], {
            templateData: {
                f: function (s) {
                    return s.replace(/$/, '.bak')
                }
            }
        })));

    gutil.log('When process stops, run \'seo-clean\'');
});

gulp.task('seo-clean',function () {
    gulp.src(['./static/custom/seo/snapshots/*.html'])
        .pipe(debug({title: 'seo file:'}))
        .pipe(gulpif((seo === 'true'), replace(/<script(.*)<\/script>/g, '')))
        .pipe(gulp.dest('./static/custom/seo/snapshots/'));
});


gulp.task('clean-min', function (cb) {
    gulp.src('./static/custom/**/*.min.js', {read: false}).pipe(clean());
    gulp.src('./static/custom/modules/**/*.min.html', {read: false}).pipe(clean());
    gulp.src('./static/custom/modules/**/*.min.json', {read: false}).pipe(clean());
});

gulp.task('bower', function () {
    return bower();
});