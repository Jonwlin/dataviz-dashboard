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

    document.getElementById('pieChartValue').innerHTML = parseFloat(results[0] + results[1] + results[2] + results[3] + results[4]+ results[5]).toFixed(0) + " MW"

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

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
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

        if (chart.index == 3) {
            let results = []
            for (let i = 0; i < chart.series.length; i++ ) {
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
    document.getElementById('solar_cost').innerHTML = ' - '
    document.getElementById('wind_cost').innerHTML = ' - '
    document.getElementById('hydro_cost').innerHTML = ' - '
    document.getElementById('gas_cost').innerHTML = ' - '
    document.getElementById('dist_cost').innerHTML = ' - '
    document.getElementById('coal_cost').innerHTML = ' - '

    document.getElementById('exports_cost').innerHTML = ''
    document.getElementById('pumps_cost').innerHTML = ''
}

async function handle_mouseOut() {
    //first column
    let total_power = 1179
    document.getElementById('total_power').innerHTML = total_power

    let solar = 82.49
    document.getElementById('solar').innerHTML = solar.toFixed(0)

    let wind = 81.49
    document.getElementById('wind').innerHTML = wind.toFixed(0)

    let hydro = 60
    document.getElementById('hydro').innerHTML = hydro.toFixed(0)

    let gas = 65
    document.getElementById('gas').innerHTML = gas.toFixed(0)

    let dist = 0.02
    document.getElementById('dist').innerHTML = dist

    let coal = 891.4
    document.getElementById('coal').innerHTML = coal.toFixed(0)

    let exports = -2.49
    document.getElementById('exports').innerHTML = exports.toFixed(0)

    let pumps = -12.1
    document.getElementById('pumps').innerHTML = pumps.toFixed(0)

    document.getElementById('loads_total').innerHTML = (exports + pumps).toFixed(0)

    let net = 1165.8
    document.getElementById('net').innerHTML = net.toFixed(0)

    // second column
    let solar_contr = ((solar / net) * 100).toFixed(1)
    document.getElementById('solar_contr').innerHTML = solar_contr + "%"

    let wind_contr = ((wind / net) * 100).toFixed(1)
    document.getElementById('wind_contr').innerHTML = wind_contr + "%"

    let hydro_contr = ((hydro / net) * 100).toFixed(1)
    document.getElementById('hydro_contr').innerHTML = hydro_contr + "%"

    document.getElementById('gas_contr').innerHTML = ((gas / net) * 100).toFixed(1) + "%"
    document.getElementById('dist_contr').innerHTML = ((dist / net) * 100).toFixed(3) + "%"
    document.getElementById('coal_contr').innerHTML = ((coal / net) * 100).toFixed(1) + "%"

    document.getElementById('exports_contr').innerHTML = ((exports / net) * 100).toFixed(1) + "%"
    document.getElementById('pumps_contr').innerHTML = ((pumps / net) * 100).toFixed(1) + "%"

    let renewables = parseFloat(solar_contr) + parseFloat(wind_contr) + parseFloat(hydro_contr)
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

Highcharts.theme = {
 colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
  '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
 chart: {
  backgroundColor: {
     linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
     stops: [
        [0, '#2a2a2b'],
        [1, '#3e3e40']
     ]
  },
  style: {
     fontFamily: '\'Unica One\', sans-serif'
  },
  plotBorderColor: '#606063'
 },
 title: {
  style: {
     color: '#E0E0E3',
     textTransform: 'uppercase',
     fontSize: '20px'
  }
 },
 subtitle: {
  style: {
     color: '#E0E0E3',
     textTransform: 'uppercase'
  }
},
xAxis: {
  gridLineColor: '#707073',
  labels: {
     style: {
        color: '#E0E0E3'
     }
  },
  lineColor: '#707073',
  minorGridLineColor: '#505053',
  tickColor: '#707073',
  title: {
     style: {
        color: '#A0A0A3'

     }
  }
},
yAxis: {
  gridLineColor: '#707073',
  labels: {
     style: {
        color: '#E0E0E3'
     }
  },
  lineColor: '#707073',
  minorGridLineColor: '#505053',
  tickColor: '#707073',
  tickWidth: 1,
  title: {
     style: {
        color: '#A0A0A3'
     }
  }
},
tooltip: {
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  style: {
     color: '#F0F0F0'
 },
  padding: 15
},
plotOptions: {
  series: {
     dataLabels: {
        color: '#B0B0B3'
     },
     marker: {
        lineColor: '#333'
     }
  },
  boxplot: {
     fillColor: '#505053'
  },
  candlestick: {
     lineColor: 'white'
  },
  errorbar: {
     color: 'white'
  }
},
legend: {
  itemStyle: {
     color: '#E0E0E3'
  },
  itemHoverStyle: {
     color: '#FFF'
  },
  itemHiddenStyle: {
     color: '#606063'
  }
},
credits: {
  style: {
     color: '#666'
  }
},
labels: {
  style: {
     color: '#707073'
  }
},

drilldown: {
  activeAxisLabelStyle: {
     color: '#F0F0F3'
  },
  activeDataLabelStyle: {
     color: '#F0F0F3'
  }
},

navigation: {
  buttonOptions: {
     symbolStroke: '#DDDDDD',
     theme: {
        fill: '#505053'
     }
  }
},

// scroll charts
rangeSelector: {
  buttonTheme: {
     fill: '#505053',
     stroke: '#000000',
     style: {
        color: '#CCC'
     },
     states: {
        hover: {
           fill: '#707073',
           stroke: '#000000',
           style: {
              color: 'white'
           }
        },
        select: {
           fill: '#000003',
           stroke: '#000000',
           style: {
              color: 'white'
           }
        }
     }
  },
  inputBoxBorderColor: '#505053',
  inputStyle: {
     backgroundColor: '#333',
     color: 'silver'
  },
  labelStyle: {
     color: 'silver'
  }
},

navigator: {
  handles: {
     backgroundColor: '#666',
     borderColor: '#AAA'
  },
  outlineColor: '#CCC',
  maskFill: 'rgba(255,255,255,0.1)',
  series: {
     color: '#7798BF',
     lineColor: '#A6C7ED'
  },
  xAxis: {
     gridLineColor: '#505053'
  }
},

scrollbar: {
  barBackgroundColor: '#808083',
  barBorderColor: '#808083',
  buttonArrowColor: '#CCC',
  buttonBackgroundColor: '#606063',
  buttonBorderColor: '#606063',
  rifleColor: '#FFF',
  trackBackgroundColor: '#404043',
  trackBorderColor: '#404043'
},

// special colors for some of the
legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
background2: '#505053',
dataLabelsColor: '#B0B0B3',
textColor: '#C0C0C0',
contrastTextColor: '#F0F0F3',
maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);


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

    handle_mouseOut()

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
            padding: 15,
            positioner: function () {
                return {
                    // right aligned
                    x: this.chart.chartWidth - this.label.width,
                    y: 10 // align to title
                };
            },
            borderWidth: 0,
            backgroundColor: 'none',
            // pointFormat: '${point.y}',
            pointFormatter: function() {
                let date = new Date(this.x);
                date.addHours(8);
                const month = date.toLocaleString('default', { month: 'short' });
                let minutes = Math.round(date.getMinutes() / 60) * 30
                let hours = date.getHours()
                let suffix = 'AM'
                if (hours >= 12) {
                    suffix = "PM"
                }
                if (hours > 12) {
                    hours = hours - 12
                }
                return date.getDate() + " " + month + ", " + hours + ":" + ("0" + minutes).slice(-2) + " " + suffix + " $" + this.y + "  ";
            },
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
                pointStart: Date.UTC(2019, 10, 20, 0),
                pointInterval: 24 * 60 * 1000,
                point: {
                    events: {
                        mouseOver: function(e) {
                            handle_mouseMove(this, e)
                        },
                        mouseOut: function(e) {
                            handle_mouseOut();
                        }
                    }
                }
           },
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
            padding: 15,
            positioner: function () {
                return {
                    // right aligned
                    x: this.chart.chartWidth - this.label.width,
                    y: 10 // align to title
                };
            },
            borderWidth: 0,
            backgroundColor: 'none',
            pointFormatter: function() {
                let date = new Date(this.x);
                date.addHours(8);
                const month = date.toLocaleString('default', { month: 'short' });
                let minutes = Math.round(date.getMinutes() / 60) * 30
                let hours = date.getHours()
                let suffix = 'AM'
                if (hours >= 12) {
                    suffix = "PM"
                }
                if (hours > 12) {
                    hours = hours - 12
                }
                return date.getDate() + " " + month + ", " + hours + ":" + ("0" + minutes).slice(-2) + " " + suffix + " " + this.y + "°F" + "  ";
            },
            headerFormat: '',
            shadow: false,
            style: {
                fontSize: '18px'
            },
            crosshairs: true
        },
        plotOptions: {
            series: {
                pointStart: Date.UTC(2019, 10, 20, 0),
                pointInterval: 24 * 60 * 1000,
                point: {
                    events: {
                        mouseOver: function(e) {
                            handle_mouseMove(this, e)
                        },
                        mouseOut: function(e) {
                            handle_mouseOut();
                        }
                    }
                }
           },
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
            margin: [0, 0, 0, 0],
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
            text: 'SpringField Energy',
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
            padding: 12,
            pointFormatter: function() {
                let date = new Date(this.x);
                date.addHours(8);
                const month = date.toLocaleString('default', { month: 'short' });
                let minutes = Math.round(date.getMinutes() / 60) * 30
                let hours = date.getHours()
                let suffix = 'AM'
                if (hours >= 12) {
                    suffix = "PM"
                }
                if (hours > 12) {
                    hours = hours - 12
                }
                return date.getDate() + " " + month + ", " + hours + ":" + ("0" + minutes).slice(-2) + " " + suffix +" "+ this.series.name + " " + this.y + "  ";
            },
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
                pointStart: Date.UTC(2019, 10, 20, 0),
                pointInterval: 24 * 60 * 1000,
                point: {
                    events: {
                        mouseOver: function(e) {
                            handle_mouseMove(this, e)
                        },
                        mouseOut: function(e) {
                            handle_mouseOut();
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
