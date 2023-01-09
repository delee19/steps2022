// JS 
var data, 
  chart, 
  weekdayNames = 'S,M,T,W,T,F,S'.split(','); 
  
fetch('./data/steps.csv') 
  .then(function(response) { 
    return response.text(); 
  }) 
  .then(function(text) { 
    data = JSC.csv2Json(text); 
    let dateRange = [ 
      new Date('1/1/2017'), 
      new Date('12/31/2017') 
    ]; 
    /* Filter out dates outside 2022*/
    data = data.filter(function(entry) { 
      var d = new Date(entry.Date); 
      return ( 
        d >= dateRange[0] && d < dateRange[1] 
      ); 
    }); 
  
    addTicks(); 
  }); 
  
function addTicks() { 
  var weekData = JSC.nest() 
    .key({ key: 'Date', pattern: 'week' }) 
    .rollup('Actual', 'sum') 
    .pointRollup(function(key, values) { 
      return { 
        date: key, 
        value: JSC.sum(values) 
      }; 
    }) 
    .points(data); 
  
  var maxValue = JSC.max(weekData, 'value'); 
  
  var customTicksX = weekData.map(function(d, i) { 
    return { 
      value: i + 1, 
      label_text: 
        '<chart bar data=' + 
        d.value + 
        " tooltip='" + 
        d.value + 
        " Steps' max=" + 
        maxValue + 
        ' height=13 width=60 radius=3 colors=#8c96c6,#f5f5f5>'
    }; 
  }); 
  
  var weekdayData = JSC.nest() 
    .key({ key: 'Date', pattern: 'weekday' }) 
    .rollup('Actual', 'sum') 
    .pointRollup(function(key, values) { 
      return { 
        date: key, 
        value: JSC.sum(values) 
      }; 
    }) 
    .points(data); 
  
  maxValue = JSC.max(weekdayData, 'value'); 
  
  var customTicksY = weekdayData.map(function( 
    d, 
    i 
  ) { 
    return { 
      value: i, 
      label_text: 
        weekdayNames[i] + 
        '<br><chart bar data=' + 
        d.value + 
        " tooltip='" + 
        d.value + 
        " Steps' max=" + 
        maxValue + 
        ' rotate=-90 radius=3 colors=#8c96c6,#f5f5f5 height=13 width=60 alt=TT>'
    }; 
  }); 
  
  var chartConfig = JSC.merge( 
    { 
      debug: true, 
      type: 'horizontal calendar year solid', 
      title_label_text: 'Daily Steps 2017', 
      data: './data/steps.csv', 
      calendar: { 
        range: ['1/1/2017', '12/31/2017'], 
        defaultEdgePoint: { 
          tooltip: '', 
          mouseTracking: false
        } 
      }, 
      legend: { position: 'right top' }, 
      palette: { 
        colors: [ 
          '#f7fcfd', 
          '#e0ecf4', 
          '#bfd3e6', 
          '#9ebcda', 
          '#8c96c6', 
          '#8c6bb1', 
          '#88419d', 
          '#810f7c', 
          '#4d004b'
        ], 
        colorBar_axis_scale_interval: 5000 
      }, 
      defaultSeries_legendEntry_visible: false, 
      defaultPoint_tooltip: 
        '<b>%name</b><br> %zValue Steps', 
      toolbar_visible: false, 
      xAxis: { 
        orientation: 'right', 
        id: 'mainX', 
        defaultTick_visible: false
      }, 
      series: [ 
        { 
          points: [ 
            { 
              date: { day: 1 }, 
              label: { 
                text: '{%date:date MM}', 
                padding: 0, 
                autoHide: false
              } 
            } 
          ] 
        } 
      ] 
    }, 
    { 
      xAxis: { customTicks: customTicksX }, 
      yAxis: { customTicks: customTicksY } 
    } 
  ); 
  chart = JSC.chart('chartDiv', chartConfig); 
} 