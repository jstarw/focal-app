'use strict';

(function() {
    $(document).ready(function() {
        //store json data globally so all functions can access it
        var jsonData = [];
        $.get('http://jstarw.github.io/focal-app/data/interview.json', function(data){
            jsonData = data;
            Questions.q1(jsonData);
            Questions.q2(jsonData);
            Questions.q3(jsonData);
        });
    });

    //////////////////////////////////////////
    //                                      //
    //           Questions Object           //
    //                                      //
    //////////////////////////////////////////
    var Questions = {
        q1: function(jsonData) {
            //create bar graph
            var options = {
                width: 5000,      height: 600,       margin_top: 20, 
                margin_right: 20, margin_bottom: 30, margin_left: 40
            }
            var chartData = [];
            chartData = Util.group_data_by_operation(jsonData);
            Util.create_bar_graph(chartData, '.chart1', options);

            //attach tooltip to mean line and values in the bar graph
            Tooltip.createTooltip('.chart1 rect', 'bottom');
        },

        q2: function(jsonData) {
            //create bar graph
            var options = {
                width: 5000,      height: 600,       margin_top: 20, 
                margin_right: 20, margin_bottom: 30, margin_left: 40
            }
            var chartData = [];
            chartData = Util.group_data_by_operation(jsonData);
            Util.create_bar_graph(chartData, '.chart2', options);

            //plot the mean value on bar graph
            var mean = Util.calculate_mean(jsonData);
            var max = d3.max(chartData, function(d) { return d.average; });
            Util.plot_mean(mean, max, '.chart2');

            //attach tooltip to mean line and values in the bar graph
            Tooltip.createTooltip('.chart2 line', 'top');
            Tooltip.createTooltip('.chart2 rect', 'bottom');
        },

        q3: function(jsonData) {
            var colorPalette = [
                '#e69a61', '#9817ff', '#18c61a', '#33b4ff', '#c9167e', 
                '#297853', '#d7011b', '#7456c7', '#7e6276', '#afb113', 
                '#fd879c', '#fb78fa', '#24c373', '#45bbc5', '#766b21', 
                '#abad93', '#c19ce3', '#fd8f11', '#2f56ff', '#307a11', 
                '#b3483c', '#0d7396', '#94b665', '#9d4d91', '#b807c8', 
                '#086cbf', '#a2abc5', '#a35702', '#d3084b', '#8c6148', 
                '#fa82ce', '#71be42', '#2bc0a0', '#b64064', '#d09fa2', 
                '#daa229', '#5a6f68', '#c1aa5f', '#8943dc', '#b72ba6', 
                '#6e629e', '#e094bf', '#dd8df2', '#c03d0b', '#7db799', 
                '#617046', '#ff8a78', '#1263e2', '#91aaea', '#cea37e',
            ];
            var options = {
                width: 400,
                height: 400
            }
            var values_grouped_by_location = [];
            var operations_grouped_by_location = [];

            // get data to be used in the pie graphs
            values_grouped_by_location = Util.group_total_data_by_location(jsonData);
            operations_grouped_by_location = Util.group_total_operations_by_location(jsonData);

            // draw the two pie graphs
            Util.create_pie_graph(values_grouped_by_location, '.chart3', colorPalette, options);
            Util.create_pie_graph(operations_grouped_by_location, '.chart4', colorPalette, options);

            //attach tooltip to mean line and values in the bar graph
            Tooltip.createTooltip('.chart3 path, .chart4 path', 'top');
        } 
    }
})();