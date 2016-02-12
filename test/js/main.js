'use strict';

$(document).ready(function() {
    //store json data globally so all functions can access it
    var jsonData = [];
    $.get('data/interview.json', function(data){
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
            width: 5000,      height: 600,       margin_top: 10, 
            margin_right: 20, margin_bottom: 20, margin_left: 20
        }
        var chartData = [];
        chartData = Util.group_data_by_operation(jsonData);
        Util.create_bar_graph(chartData, '.chart1', options);

        //attach tooltip to mean line and values in the bar graph
        createTooltip('.chart1 rect', 'bottom');
    },

    q2: function(jsonData) {
        //create bar graph
        var options = {
            width: 5000,      height: 600,       margin_top: 20, 
            margin_right: 20, margin_bottom: 20, margin_left: 20
        }
        var chartData = [];
        chartData = Util.group_data_by_operation(jsonData);
        Util.create_bar_graph(chartData, '.chart2', options);

        //plot the mean value on bar graph
        var mean = Util.calculate_mean(jsonData);
        var max = d3.max(chartData, function(d) { return d.average; });
        Util.plot_mean(mean, max, '.chart2');

        //attach tooltip to mean line and values in the bar graph
        createTooltip('.chart2 line', 'top');
        createTooltip('.chart2 rect', 'bottom');
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

        values_grouped_by_location = Util.group_total_data_by_location(jsonData);
        operations_grouped_by_location = Util.group_total_operations_by_location(jsonData);

        Util.create_pie_graph(values_grouped_by_location, '.chart3', colorPalette, options);
        Util.create_pie_graph(operations_grouped_by_location, '.chart4', colorPalette, options);

        //attach tooltip to mean line and values in the bar graph
        createTooltip('.chart3 path, .chart4 path', 'top');
    } 
}

//////////////////////////////////////////
//                                      //
//          Utility Functions           //
//                                      //
//////////////////////////////////////////
var Util = {

    /**
     * Calculates average value per operation, groups data into unique operations
     * @param {Array[Object]} res: interview.json data
     * @return {Array[Object]} chartData
     *      chartData = [
     *          Object{
     *              average: {Int},
     *              count: {Int},
     *              operation: {Int},
     *              total: {Int}
     *          }, 
     *          ...
     *      ]
     */
    group_data_by_operation: function(res) {
        //building object with elements as operations
        var obj = {};
        var chartData = [];
        for (var i=0; i<res.length; i++) {
            var operation = res[i].operation;
            var value = res[i].value;

            if (!obj[operation]) {
                obj[operation] = {
                    total: value,
                    count: 1,
                    operation: operation
                };
            } else {
                obj[operation].total += value;
                obj[operation].count++;
            }
        }

        //convert object to array
        var chartData = $.map(obj, function(value, index) {
            value.average = Math.floor(value.total / value.count);
            return [value];
        });
        console.log(chartData);
        return chartData;
    },

    /**
     * Calculates the total value per location
     * @param {Array[Object]} res: interview.json data
     * @return {Array[Object]} chartData
     *      chartData = [
     *          Object{
     *              location: {Int},
     *              value: {Int}
     *          }, 
     *          ...
     *      ]
     */
    group_total_data_by_location: function(res) {
        //building object with elements as operations
        var obj = {};
        var chartData = [];
        for (var i=0; i<res.length; i++) {
            var location = res[i].location;
            var value = Math.floor(res[i].value);

            if (!obj[location]) {
                obj[location] = {
                    value: value,
                    location: location
                };
            } else {
                obj[location].value += value;
            }
        }

        //converting object to array
        var chartData = $.map(obj, function(value, index) {
            return [value];
        });
        console.log(chartData);
        return chartData;
    },

    /**
     * Calculates the total number of operations per location
     * @param {Array[Object]} res: interview.json data
     * @return {Array[Object]} chartData
     *      chartData = [
     *          Object{
     *              location: {Int};
     *              value: {Int};
     *          }, 
     *          ...
     *      ]
     */
    group_total_operations_by_location: function(res) {
        //building object with elements as operations
        var obj = {};
        var chartData = [];
        for (var i=0; i<res.length; i++) {
            var location = res[i].location;
            var value = res[i].value;

            if (!obj[location]) {
                obj[location] = {
                    value: 0,
                    location: location
                };
            } else {
                obj[location].value++;
            }
        }

        //converting object to array
        var chartData = $.map(obj, function(value, index) {
            return [value];
        });
        console.log(chartData);
        return chartData;
    },

    /**
     * Creates a bar graph from chartData
     * @param {Array[Object]} chartData
     *      chartData = [
     *          Object{
     *              average: {Int},
     *              count: {Int},
     *              operation: {Int},
     *              total: {Int}
     *          }, 
     *          ...
     *      ]
     * @param {String} selector: element name of your selection
     * @param {Object} options: set width and height in options object
     */
    create_bar_graph: function(chartData, selector, options) {
        // set the width and height based off options given
        var width  = options.width  - options.margin_left - options.margin_right,
            height = options.height - options.margin_top  - options.margin_bottom;

        // create linear scale
        var y = d3.scale.linear()
            .range([height, 0])
            .domain([0, d3.max(chartData, function(d) { return d.average; })]);

        // var xAxis = d3.svg.axis()
        //     .scale(x)
        //     .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10, "%");

        var barWidth = width / chartData.length;

        var chart = d3.select(selector)
            .attr('width', width)
            .attr('height', height)
            .append("g")
                .attr("transform", "translate(" + options.margin_left + "," + options.margin_right + ")");

        chart.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");

        var bar = chart.selectAll('g')
            .data(chartData)
                .enter().append('g')
            .attr('transform', function(d, i) { return 'translate(' + i * barWidth + ',0)'; });

        bar.append('rect')
            .attr('y', function(d) { return y(d.average); })
            .attr('height', function(d) { return height - y(d.average); })
            .attr('width', barWidth - 1)
            .attr('title', function(d) { return 'Value: ' + d.average; });

        // function to convert from string to number
        function type(d) {
            d.average = +d.average; 
            return d;
        }
    },

    /**
     * Creates a pie graph from chartData
     * @param {Array[Object]} chartData
     *      chartData = [
     *          Object{
     *              location: {Int}
     *              value: {Int}
     *          }, 
     *          ...
     *      ]
     * @param {String} selector: element name of your selection
     * @param {Array[String]} ColorPalette
     * @param {Object} options: set width and height in options object
     */
    create_pie_graph: function(chartData, selector, colorPalette, options) {
        var width  = options.width,
            height = options.height,
            radius = width/2;

        // creates color scale using color palette
        var color = d3.scale.ordinal()
            .domain([1, d3.max(chartData, function(d) { return d.location; })])
            .range(colorPalette);

        // generates arc
        var arc = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(0);

        // sets the start and end angles for a location
        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.value; });

        // creates empty svg element
        var svg = d3.select(selector)
            .attr('width', width)
            .attr('height', height)
                .append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        // appends data from chartData to svg element
        var g = svg.selectAll('.arc')
            .data(pie(chartData))
            .enter().append('g')
                .attr('class', 'arc');

        // Fill pie chart with path elements 
        g.append('path')
            .attr('d', arc)
            .attr('title', function(d) { return 'Value: '+d.data.value; })
            .style('fill', function(d, i) { return color(i); });

        // function to convert from string to number
        function type(d) {
            d.total = +d.total; 
            return d;
        }
    },

    /**
     * Calculates mean of entire dataset
     * @param {Array[Object]} jsonData: interview.json
     * @return {Int} mean
     */
    calculate_mean: function(jsonData) {
        var mean = 0;
        for (var i=0; i<jsonData.length; i++) {
            mean+= jsonData[i].value;
        }
        mean /=jsonData.length;
        return mean.toFixed(2);
    },

    /**
     * Plots mean line on bar graph
     * @param {Int} mean
     * @param {Int} max: maximum value of data in bar graph, used for linear scale
     * @param {String} selector: element name of your selection
     * @return NULL
     */
    plot_mean: function(mean, max, selector) {
        var chart  = d3.select(selector);
        var width  = chart.attr('width');
        var height = chart.attr('height');

        var y = d3.scale.linear()
            .range([0, height])
            .domain([0, max]);

        // create line element
        chart.append('g')
            .append('line')
            .attr('x1', '0')
            .attr('x2', width)
            .attr('y1', function(d) { return height - y(mean)})
            .attr('y2', function(d) { return height - y(mean)})
            .attr('title', 'Mean Value: ' + mean)
            .classed('mean-line', true);
    }
}
