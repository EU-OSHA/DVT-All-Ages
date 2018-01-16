define(function (require) {

    var configService = require('horizontal/config/configService');
    var IssueService = function (dvtUtils) {

        return {
            getStoryMainCalculations: function (story) {
                switch (story) {
                    case 1:
                        return [
                            // Assign dataPart to according to series
                            {
                                names: "dataPart",
                                calculation: function (datum, out) {
                                    var series = datum.atoms.series.value;
                                    out.dataPart = (series == "57" ? "1" : "0");
                                }
                            }
                        ];
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                    default:
                        return null;
                }
            },
            getStoryMainPlots: function (story,pCountry1,pCountry2) {
                var dashboard = this.dashboard;
                switch (story) {
                    case 1:
                        return [
                            // Main plot (type bar)
                            {
                                name: "main",
                                dataPart: "0",
                                bar_fillStyle: function (scene) {
                                    var countryKey = scene.firstAtoms.category;
                                    if (countryKey == 'EU') {
                                        return dvtUtils.getColorCountry()
                                    }
                                    else if (countryKey == pCountry1) {
                                        return dvtUtils.getColorCountry(1)
                                    }
                                    else if (countryKey == pCountry2) {
                                        return dvtUtils.getColorCountry(2)
                                    }
                                    return dvtUtils.getColorCountry(-1)
                                },
                                bar_strokeStyle: dvtUtils.getColorCountry(0),
                                visualRoles:{
                                    series:'series',
                                    category:'category'
                                }
                            },

                            // Second plot dots
                            {
                                type: "point",
                                linesVisible: false,
                                dotsVisible: true,
                                dataPart: "1",
                                dotSizeMax: 15,
                                dot_fillStyle: dvtUtils.getColorCountry(0),
                                dot_strokeStyle: dvtUtils.getColorCountry(0),
                                dot_aspectRatio: 1,
                                //dot_shapeRadius: 5,
                                colorAxis: 2,
                                visualRoles:{
                                    series:'series',
                                    category:'category'
                                }
                            },
                            //third plot 'lines'
                            {
                                type: "bar",
                                dataPart: "1",
                                barSizeMax: 0,
                                bar_fillStyle: dvtUtils.getColorCountry(0),
                                bar_strokeStyle: dvtUtils.getColorCountry(0),
                                bar_strokeDasharray: 'LongDash',
                                colorAxis: 2,
                                bar_lineWidth: 0.5,
                                visualRoles:{
                                    series:'series',
                                    category:'category'
                                }
                            }
                ]
                ;
                default:
                return null;
            }
        },
            getStoryConextualPlots
        :
        function (story) {
            switch (story) {
                case 6:
                    return [
                        // Main plot
                        {
                            name: 'main',
                            visualRoles: {
                                value: 'PIB',
                                series: 'country',
                                category: 'year',
                                color: {
                                    legend: {
                                        visible: false
                                    }
                                }
                            },
                            colorAxis: 1,
                            orthoAxis: 1
                        },
                        // Second plot
                        {
                            type: 'point',
                            linesVisible: true,
                            dotsVisible: true,
                            nullInterpolationMode: 'linear',
                            visualRoles: {
                                value: 'GDPgrouth',
                                color: {
                                    legend: {
                                        visible: false
                                    }
                                }
                            },
                            colorAxis: 2,
                            orthoAxis: 2
                        }
                    ]
            }
        }
    };
};

IssueService.$inject = ['dvtUtils'];

return IssueService;
})
;