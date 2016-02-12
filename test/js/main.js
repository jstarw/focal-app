'use strict';

//QUESTIONS OBJECT
var Questions = {
    q1: function(jsonData) {
        var chartData = [];
        chartData = Util.group_data_by_operation(jsonData);
        Util.create_bar_graph(chartData, '.chart1');
    },

    q2: function(jsonData) {
        var chartData = [];
        chartData = Util.group_data_by_operation(jsonData);
        Util.create_bar_graph(chartData, '.chart2');

        //plot the mean value on bar graph
        var mean = Util.calculate_mean(jsonData);
        var max = d3.max(chartData, function(d) { return d.average; });
        Util.plot_mean(mean, max, '.chart2');
    },

    q3: function(jsonData) {
        var chartData = [];
        chartData = Util.group_total_data_by_location(jsonData);
    } 
}

//UTILITY OBJECT
var Util = {

    /**
     * Calculates average value per operation, groups data into unique operations
     * @param {Array[Object]} res: interview.json data
     * @return {Array[Object]} chartData
     *      chartData = [
     *          Object{
     *              average: {Int};
     *              count: {Int};
     *              operation: {Int};
     *              total: {Int};
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
     *              location: {Int};
     *              total: {Int};
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
            var value = res[i].value;

            if (!obj[location]) {
                obj[location] = {
                    total: value,
                    location: location
                };
            } else {
                obj[location].total += value;
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
     *              average: {Int};
     *              count: {Int};
     *              operation: {Int};
     *              total: {Int};
     *          }, 
     *          ...
     *      ]
     * @return {String} selector: element name of your selection
     */
    create_bar_graph: function(chartData, selector) {
        var width = 5000,
            height = 600;

        var y = d3.scale.linear()
            .range([height, 0]);

        var chart = d3.select(selector)
            .attr('width', width)
            .attr('height', height);
        console.log(chart.attr('width'));

        y.domain([0, d3.max(chartData, function(d) { return d.average; })]);

        var barWidth = width / chartData.length;

        var bar = chart.selectAll('g')
            .data(chartData)
                .enter().append('g')
            .attr('transform', function(d, i) { return 'translate(' + i * barWidth + ',0)'; });

        bar.append('rect')
            .attr('y', function(d) { return y(d.average); })
            .attr('height', function(d) { return height - y(d.average); })
            .attr('width', barWidth - 1);

        // function to convert from string to number
        function type(d) {
            d.average = +d.average; 
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
        return mean;
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

        chart.append('g')
            .append('line')
            .attr('x1', '0')
            .attr('x2', width)
            .attr('y1', function(d) { return height - y(mean)})
            .attr('y2', function(d) { return height - y(mean)})
            .classed('mean-line', true);
    }
}


$(document).ready(function() {
    //store json data globally so all functions can access it
    var jsonData = [];
    $.get('data/interview.json', function(data){
        jsonData = data;
        Questions.q1(jsonData);
        // Questions.q2(jsonData);
        Questions.q3(jsonData);
    });
});