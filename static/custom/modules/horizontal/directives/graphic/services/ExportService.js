/**
 * @ngdoc service
 * @name dvt.charting.ExportService
 * @requires dom-to-image library
 * @requires file-saver library
 */
define(function(require){
    
   // var PromiseR = require('common-exporting/es6-promise-polyfill'); //para el explorer


    // PromiseR.Promise;
    // $log.info(PromiseR.Promise);
    // PromiseR.polyfill();
    var html2canvas = require('common-exporting/html2canvas');

    var ExportService = function($log, $q, $state) {

    var ExportPopupComponent = require('cde/components/ExportPopupComponent');

    // expose saveAs
    require('common-exporting/file-saver');

    var exportImage = function (scope) {


            window._paq.push(['trackEvent', $state.current.name,'Export','Image']);
            var node = $('#' + scope.id).parents('.dvt-chart')[0];
            /*
            var nodeSvg = $(node).find('svg')[0];
            var nodeSvgHtml = nodeSvg.outerHTML;
            */

            //---------------------------------
            // 2
            //---------------------------------
            // var html2canvas = require('common-exporting/html2canvas');
            // html2canvas(node)
            // .then(function(canvas) {
            //
            //     canvas.toBlob(function(blob){
            //         if(scope.title=="undefined" || scope.title==undefined) {
            //             //anterior h2 que haya....
            //             scope.titleH2=$("#"+scope.id).parents().find("h2:eq(0)").text()
            //             var filename = scope.titleH2 + '.png';
            //         } else {
            //             var filename = scope.title + '.png';
            //         }
            //         saveAs(blob,filename);
            //     });
            // });


            //---------------------------------
            // 1 dom-to-image

            //convierto el svg a imagen...
            var svg = document.querySelector('.modal svg');
            var xml = Utf8Encode(new XMLSerializer().serializeToString(svg)); //Created with Raphaël... creo que es por esto

            //console.log(xml);
            var svg64 = btoa(xml);

            var b64Start = "data:image/svg+xml;base64,";
            var image64 = b64Start + svg64;


            angular.element('.modal svg').after("<img id='svg2image'>");
            var img = document.getElementById('svg2image');
            img.src = image64;
            angular.element(".modal svg").attr("style","display:none");
            
           // var node = $('#' + scope.id).parents('.dvt-chart')[0];
            $(".dropdown").hide();
            angular.element(".legend-info").attr("style","display:none");

            //$log.info(PromiseR);
            //$log.info(PromiseR.Promise());
            //var Promise=PromiseR.Promise;


             html2canvas(node)
             .then(function(canvas) {
                 canvas.toBlob(function(blob){
                     if(scope.title=="undefined" || scope.title==undefined) {
                         //anterior h2 que haya....
                         scope.titleH2=$("#"+scope.id).parents().find("h2:eq(0)").text()
                         var filename = scope.titleH2 + '.png';
                     } else {
                         var filename = scope.title + '.png';
                    }

                     saveAs(blob,filename);

                     $(".dropdown").show();
                     $("#svg2image").remove();
                     angular.element(".modal svg").removeAttr("style");
                     angular.element(".legend-info").removeAttr("style","display:none");
                 });
             });

        
            //---------------------------------
/*
            require('common-exporting/dom-to-image');
            domtoimage.toBlob(node, {
                filter:function(node){
                    return (node.className !== 'contextual-menu')
                }
            }).then(function(blob){
                if(scope.title=="undefined" || scope.title==undefined) {
                    //anterior h2 que haya....
                    scope.titleH2=$("#"+scope.id).parents().find("h2:eq(0)").text();
                    var filename = scope.titleH2 + '.png';
                } else {
                    var filename = scope.title + '.png';
                }

                saveAs(blob,filename);
               // angular.element(".modal svg").show();
                //angular.element('#svg2image').remove();
            });
*/


            //---------------------------------
            // 3 (canvg + dom-to-image)
            //---------------------------------

            // require('common-exporting/canvg');
            // require('common-exporting/rgbcolor');
            // var canvas =  document.createElement('canvas');
            // canvas.setAttribute('width','500px');
            // canvas.setAttribute('height','500px');
            // canvg(canvas,nodeSvgHtml);
            //
            //
            // $(nodeSvg).replaceWith(canvas);
            //
            // require('common-exporting/dom-to-image');
            // domtoimage.toBlob(node, {
            //     filter:function(node){
            //         return (node.className !== 'contextual-menu')
            //     }
            // }).then(function(blob){
            //     if(scope.title=="undefined" || scope.title==undefined) {
            //         //anterior h2 que haya....
            //         scope.titleH2=$("#"+scope.id).parents().find("h2:eq(0)").text()
            //         var filename = scope.titleH2 + '.png';
            //     } else {
            //         var filename = scope.title + '.png';
            //     }
            //
            //     saveAs(blob,filename);
            // });
        };

        /**
         * Encodes multi-byte Unicode string into utf-8 multiple single-byte characters
         * (BMP / basic multilingual plane only).
         *
         * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars.
         *
         * Can be achieved in JavaScript by unescape(encodeURIComponent(str)),
         * but this approach may be useful in other languages.
         *
         * @param {string} strUni Unicode string to be encoded as UTF-8.
         * @returns {string} Encoded string.
         */
        function Utf8Encode(strUni) {
            return String(strUni).replace(
                /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
                function (c) {
                    var cc = c.charCodeAt(0);
                    return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
                }
            ).replace(
                /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
                function (c) {
                    var cc = c.charCodeAt(0);
                    return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
                }
            );
        }

        /**
         * Decodes utf-8 encoded string back into multi-byte Unicode characters.
         *
         * Can be achieved JavaScript by decodeURIComponent(escape(str)),
         * but this approach may be useful in other languages.
         *
         * @param {string} strUtf UTF-8 string to be decoded back to Unicode.
         * @returns {string} Decoded string.
         */
        function Utf8Decode(strUtf) {
            // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
            // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
            return String(strUtf).replace(
                /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
                function (c) {  // (note parentheses for precedence)
                    var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | ( c.charCodeAt(2) & 0x3f);
                    return String.fromCharCode(cc);
                }
            ).replace(
                /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
                function (c) {  // (note parentheses for precedence)
                    var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                    return String.fromCharCode(cc);
                }
            );
        }

        var exportData = function(scope, dashboard){

            window._paq.push(['trackEvent', $state.current.name,'Export','CSV']);
            //window._paq.push(['trackEvent', $state.current.name, 'maximize', 'nameMaximize', 'valueMaximize', {dimensionMaximize1: 'DimensionMaximizeValue'}]);

            var title=(scope.title);
            title=title.replace(/;/g," ").replace(/,/g, " ").replace(/ +/g, "_");
            var exportDefinition = {
                type: "ExportPopupComponent",
                dataExportAttachmentName: title
            };

            var component = '' + scope.id;
            exportDefinition.dataExportType = "csv";
            exportDefinition.dataComponent = dashboard.dashboard.getComponentByName(component);

            var exportComponent = new ExportPopupComponent(exportDefinition);

            exportComponent.dashboard = dashboard.dashboard;

            var columns="";
            var numberColumns=exportComponent.dataComponent.chart.metadata.length;


            for(i=0;i<numberColumns;i++) {
                columns+=exportComponent.dataComponent.chart.metadata[i].colName+";"
            }
            columns=columns.substring(0, columns.length - 1);


            var data="";

            for(i=0;i<exportComponent.dataComponent.chart.resultset.length;i++) {

                var dataTMP=exportComponent.dataComponent.chart.resultset[i];

                for(a=0;a<dataTMP.length;a++) {

                    var value=exportComponent.dataComponent.chart.resultset[i][a];

                    if(!isNaN(value) && (value<-1 || (value>-1 && value<0))) {
                        data+=Math.abs(value)+";";
                    } else {
                        data+=value+";";
                    }
                }
                data=data.substring(0, data.length - 1)+"\n";
            }

            var downloadCSV = function() {
                var BOM = "\uFEFF";
                var csv = BOM + columns+"\n"+data;
               // var csv =columns+"\n"+data;

                var blob = new Blob([ csv ], { type: "text/csv;charset=UTF-8" });
                saveAs(blob, title+".csv");
            };

            downloadCSV();
           //exportComponent.exportData();
        };

        return{
            exportImageAction: exportImage,
            exportDataAction: exportData
        }
    };

    ExportService.$inject = ['$log', '$q', '$state'];

    return ExportService;
});