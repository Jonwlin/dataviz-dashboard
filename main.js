//instance variables
let curr_index = 0;
let saved_chart_index = 0
let stack_chart_index = 0;
let energy_consumption = null;
let pumps_array = null;
let exports_array = null;

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

async function handle_pieChart(chart, results) {

    chart.series[0].setData([{
        name: 'Black Coal',
        y: results[0]
    }, {
        name: 'Distillate',
        y: results[1]
    }, {
        name: 'Gas CCGT',
        y: results[2]
    }, {
        name: 'Hydro',
        y: results[3]
    }, {
        name: 'Solar',
        y: results[4]
    },{
        name: 'Wind',
        y: results[5]
    }], true)
}

async function handle_mouseMove(current_chart, e) {
    var chart,
    point,
    i;

    curr_index = current_chart.index

    for (i = 0; i < Highcharts.charts.length; i++) {
        chart = Highcharts.charts[i];

        if (chart.series[0].name == "Power Pie" ) {
            continue;
        }
        console.log(chart)

        if (chart.index == 3) {
            let results = []
            for (let i = 0; i < chart.series.length; i++ ) {
                console.log(chart)
                console.log("FOR: " + i + " ")
                results.push( chart.series[i].points[curr_index].y )
            }
            handle_pieChart(Highcharts.charts[2], results);
        }

        point = chart.series[0].points[curr_index]

        point.series.chart.tooltip.refresh(point)

        //draw mouseover for each stacked line
        chart.xAxis[0].drawCrosshair(event, point);
    }

    handle_legend()
}

async function handle_legend() {
    if (!energy_consumption) {
        return;
    }

    for (let i = 0; i < Highcharts.charts.length; i++ ) {
        Highcharts.charts[i]
    }

    stack = Highcharts.charts[3]
    console.log(stack)

    //first column
    let total_power = parseFloat(stack.series[0].stackedYData[curr_index]).toFixed(2)
    document.getElementById('total_power').innerHTML = total_power
    let solar = parseFloat(stack.series[4].yData[curr_index]).toFixed(2)
    document.getElementById('solar').innerHTML = solar
    let wind = stack.series[5].yData[curr_index]
    document.getElementById('wind').innerHTML = wind
    let hydro = stack.series[3].yData[curr_index]
    document.getElementById('hydro').innerHTML = hydro
    let gas = stack.series[2].yData[curr_index]
    document.getElementById('gas').innerHTML = gas
    let dist = stack.series[1].yData[curr_index]
    document.getElementById('dist').innerHTML = dist
    let coal = stack.series[0].yData[curr_index]
    document.getElementById('coal').innerHTML = coal

    let exports = -parseFloat(exports_array[curr_index])
    document.getElementById('exports').innerHTML = exports
    let pumps = -parseFloat(pumps_array[curr_index])
    document.getElementById('pumps').innerHTML = pumps


    document.getElementById('loads_total').innerHTML = exports + pumps

    let net = parseFloat(total_power + exports + pumps)

    document.getElementById('net').innerHTML = net

    // second column
    let solar_contr = ((solar / demand[curr_index]) * 100).toFixed(2)
    document.getElementById('solar_contr').innerHTML = solar_contr + "%"
    let wind_contr = ((wind / demand[curr_index]) * 100).toFixed(2)
    document.getElementById('wind_contr').innerHTML = wind_contr + "%"
    let hydro_contr = ((hydro / demand[curr_index]) * 100).toFixed(2)
    document.getElementById('hydro_contr').innerHTML = hydro_contr + "%"
    document.getElementById('gas_contr').innerHTML = ((gas / demand[curr_index]) * 100).toFixed(2) + "%"
    document.getElementById('dist_contr').innerHTML = ((dist / demand[curr_index]) * 100).toFixed(2) + "%"
    document.getElementById('coal_contr').innerHTML = ((coal / demand[curr_index]) * 100).toFixed(2) + "%"

    document.getElementById('exports_contr').innerHTML = ((exports / demand[curr_index]) * 100).toFixed(2) + "%"
    document.getElementById('pumps_contr').innerHTML = ((pumps / demand[curr_index]) * 100).toFixed(2) + "%"

    let renewables = parseFloat(solar_contr + wind_contr + hydro_contr).toFixed(2)
    document.getElementById('renewables').innerHTML = renewables + "%"

    // third column
    document.getElementById('total_cost').innerHTML = '$58.62'

    document.getElementById('solar_cost').innerHTML = '$49.82'
    document.getElementById('wind_cost').innerHTML = '$56.43'
    document.getElementById('hydro_cost').innerHTML = '$63.96'
    document.getElementById('gas_cost').innerHTML = '$60.22'
    document.getElementById('dist_cost').innerHTML = '$57.42'
    document.getElementById('coal_cost').innerHTML = '$59.01'

    document.getElementById('exports_cost').innerHTML = '$65.36'
    document.getElementById('pumps_cost').innerHTML = '$46.49'
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
    energy_consumption = activity;

    pumps_array = filter( activity[4].history.data, 1, 336)
    exports_array = filter( activity[6].history.data, 1, 336)
    demand = filter( activity[9].history.data, 1, 336)

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
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%a %d %b'
            }
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
                pointStart: Date.UTC(2019, 10, 21),
                pointInterval: 24 * 60 * 1000,
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
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%a %d %b'
            }
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
                pointStart: Date.UTC(2019, 10, 21),
                pointInterval: 24 * 60 * 1000,
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
            name: 'Solar',
            data: filter( activity[7].forecast.data, 1, 336)
        },{
            name: 'Wind',
            data: filter( activity[5].history.data, 6, 336)
        }]
      });
  }
});
