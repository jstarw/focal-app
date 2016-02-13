
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

        //pushes objects inside obj into array
        var chartData = $.map(obj, function(value, index) {
            value.average = Math.floor(value.total / value.count);
            return [value];
        });

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

        //pushes objects inside obj into array
        var chartData = $.map(obj, function(value, index) {
            return [value];
        });

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
        var x = d3.scale.linear()
            .range([0, width])
            .domain([0, d3.max(chartData, function(d) { return d.operation; })]);

        var y = d3.scale.linear()
            .range([height, 0])
            .domain([0, d3.max(chartData, function(d) { return d.average; })]);

        // create x and y axis 
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(10);

        var barWidth = width / chartData.length;

        //selects svg element and appends empty g element
        var chart = d3.select(selector)
            .attr('width', options.width)
            .attr('height', options.height)
            .append('g')
                .attr('transform', 'translate(' + options.margin_left + ',' + options.margin_top + ')');

        // appends data from chartData to svg element
        var bar = chart.selectAll('g')
            .data(chartData)
                .enter().append('rect')
            .attr('y', function(d) { return y(d.average); })
            .attr('x', function(d, i) { return i * barWidth; })
            .attr('height', function(d) { 
                if (height - y(d.average<0)) return 0; // check for negative numbers
                else return height - y(d.average); 
            })
            .attr('width', barWidth - 1)
            .attr('title', function(d) { return 'Value: ' + d.average; });

        // add y axis
        chart.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 15)
            .attr('x', 10)
            .style('text-anchor', 'end')
            .text('Average Value');

        // add x axis
        chart.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            .append('text')
            .attr('x', 10)
            .attr('y', 15)
            .text('Operation Field');

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
     */
    plot_mean: function(mean, max, selector) {
        var chart  = d3.select(selector);
        var width  = chart.attr('width');
        var height = chart.attr('height');

        // create linear scale 
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
