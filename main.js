//instance variables
let curr_index = 0;
let saved_chart_index = 0
let stack_chart_index = 0;

function range(start, edge, step) {
  // If only 1 number passed make it the edge and 0 the start
  if (arguments.length === 1) {
    edge = start;
    start = 0;
  }

  // Validate edge/start
  edge = edge || 0;
  step = step || 1;

  // Create array of numbers, stopping before the edge
  let arr = [];
  var start_date = new Date(2019, 10, 21)
  var curr_date = start_date
  var end_date = new Date(2019, 10, 28, 0, 30)

  for (arr; curr_date.getTime() < end_date.getTime();) {
    curr_date = new Date(curr_date.getTime() + step*60000)
    arr.push(curr_date);
  }
  return arr;
}

function filter(data, steps, goal) {
    let arr = []
    for (var i = 0; i < data.length; i = i + steps) {
        arr.push(data[i])
    }
    if (arr.length > goal) {
        arr.pop();
    }
    return arr
}

function handle_mouseMove(moused_chart, e) {
    var chart,
    point,
    i;

    var current_chart = moused_chart;

    console.log(current_chart)

    console.log("X: " + current_chart.x + " Y: " + current_chart.y)

    console.log(e)

    console.log(e.target.series.name)

    console.log(e.target.series.chart)

    console.log(Highcharts.charts)

    curr_index = current_chart.index

    console.log(current_chart)

    console.log("entering first part")
    for (i = 0; i < Highcharts.charts.length; i++) {
        chart = Highcharts.charts[i];

        if (chart.series[0].name == "Power Pie" ) {
            continue;
        }

        console.log(chart)

        point = chart.series[0].points[curr_index]

        chart.tooltip.hide();

        // Highcharts.prototype.onMouseOver(this); //create mouse over icon

        console.log("Point")
        console.log(point)

        point.series.chart.tooltip.refresh(point)

        //draw mouseover for each stacked line
        chart.xAxis[0].drawCrosshair(event, point);
    }
}

/**
 * Synchronize zooming through the setExtremes event handler.
 */
 function syncExtremes(e) {
     var thisChart = this.chart;

     if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
         Highcharts.each(Highcharts.charts, function (chart) {
             if (chart !== thisChart) {
                 if (chart.xAxis[0].setExtremes) { // It is null while updating
                     chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
                 }
             }
         });
     }
 }

const chart_margins = .3 * screen.width;
const chart_width = .7 * screen.width

// Get the data. The contents of the data file can be viewed at
Highcharts.ajax({
  url: 'springfield.json',
  dataType: 'text',
  success: function (activity) {

    activity = JSON.parse(activity);

    var stackContainer = document.getElementById('stackChart')
    var priceContainer = document.getElementById('line1Chart')
    var tempContainer = document.getElementById('line2Chart')
    var pieContainer = document.getElementById('pieChart')

    Highcharts.chart(priceContainer, {
        chart: {
            type: 'line',
            height: .20 * screen.height
        },
        title: {
            text: 'Price $/MWh',
            align: 'left',
            verticalAlign: 'top'
        },
        legend:{ enabled:false },
        tooltip: {
            valueSuffix: '',
            positioner: function () {
                return {
                    // right aligned
                    x: this.chart.chartWidth - this.label.width,
                    y: 10 // align to title
                };
            },
            borderWidth: 0,
            backgroundColor: 'none',
            pointFormat: '${point.y}',
            headerFormat: '',
            shadow: false,
            style: {
                fontSize: '18px'
            },
            crosshairs: true
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                },
                point: {
                    events: {
                        mouseOver: function(e) {
                            console.log("Price Chart Mouse Moving")
                            handle_mouseMove(this, e);
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Price',
            data: activity[8].history.data
        }]
    });

    Highcharts.chart(tempContainer, {
        chart: {
            type: 'line',
            height: .20 * screen.height
        },
        title: {
            text: 'Temperature °F',
            align: 'left',
            verticalAlign: 'top'
        },
        legend:{ enabled:false },
        tooltip: {
            valueSuffix: '°F',
            positioner: function () {
                return {
                    // right aligned
                    x: this.chart.chartWidth - this.label.width,
                    y: 10 // align to title
                };
            },
            borderWidth: 0,
            backgroundColor: 'none',
            pointFormat: 'Av {point.y}',
            headerFormat: '',
            shadow: false,
            style: {
                fontSize: '18px'
            },
            crosshairs: true
        },
        plotOptions: {
            series: {
                point: {
                    events: {
                        mouseOver: function(e) {
                            console.log("Temperature Chart Mouse Moving")
                            handle_mouseMove(this, e)
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Temperature',
            data: activity[10].history.data
        }]
    });

    Highcharts.chart(pieContainer, {
        chart: {
            type: 'pie',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            margin: 0,
            spacingTop: 0,
            spacingBottom: 0,
            spacingLeft: 0,
            spacingRight: 0,
            backgroundColor: 'transparent'
        },
        title: {
            text: '',
        },
        plotOptions: {
            pie: {
                slicedOffset: 0,
                size: '100%',
                dataLabels: {
                    enabled: false
                },
                shadow: false,
                center: ['50%', '50%'],
                cursor: 'pointer',
            }
        },
        legend:{ enabled:false },
        series: [{
            name: 'Power Pie',
            colorByPoint: true,
            size: '90%',
            innerSize: '55%',
            data: [{
                name: 'Black Coal',
                y: activity[0].history.data[curr_index]
            }, {
                name: 'Distillate',
                y: activity[1].history.data[curr_index]
            }, {
                name: 'Gas CCGT',
                y: activity[2].history.data[curr_index]
            }, {
                name: 'Hydro',
                y: activity[3].history.data[curr_index]
            }, {
                name: 'Pumps',
                y: activity[4].history.data[curr_index]
            },{
                name: 'Wind',
                y: activity[5].history.data[curr_index]
            }]
        }]
    });

    Highcharts.chart(stackContainer, {
        chart: {
            type: 'area',
            height: .45 * screen.height
        },
        title: {
            text: 'Energy   Springfield',
            align: 'left',
            verticalAlign: 'top'
        },
        subtitle: {
        },
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%a %d %b'
            }
            // categories: range(0, 0, 30)
        },
        yAxis: {
            title: {
                text: 'MW'
            },
            labels: {
            }
        },
        tooltip: {
            valueSuffix: ' MW',
            positioner: function () {
                return {
                    // right aligned
                    x: this.chart.chartWidth - this.label.width,
                    y: 10 // align to title
                };
            },
            borderWidth: 0,
            backgroundColor: 'none',
            pointFormat: '{series.name} {point.y}',
            headerFormat: '',
            shadow: false,
            style: {
                fontSize: '18px'
            },
            crosshairs: true,
            animation: true,
            split: false,
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
            },
            series: {
                marker: {
                    enabled: false
                },
                pointStart: Date.UTC(2019, 10, 21),
                pointInterval: 24 * 60 * 1000,
                point: {
                    events: {
                        mouseOver: function(e) {
                            console.log("Stacked Chart Mouse Moving");
                            handle_mouseMove(this, e)
                        }
                    }
                }
           },
        },
        series: [{
            name: 'Black Coal',
            data: filter( activity[0].history.data, 6, 336)
        }, {
            name: 'Distillate',
            data: filter( activity[1].history.data, 6, 336)
        }, {
            name: 'Gas CCGT',
            data: filter( activity[2].history.data, 6, 336)
        }, {
            name: 'Hydro',
            data: filter( activity[3].history.data, 6, 336)
        }, {
            name: 'Pumps',
            data: filter( activity[4].history.data, 6, 336)
        },{
            name: 'Wind',
            data: filter( activity[5].history.data, 6, 336)
        }]
      });
  }
});
