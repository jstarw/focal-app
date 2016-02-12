'use strict';

var arr = [];

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($scope, $http) {
	$http.get("data/interview.json").then(function(res) {
		$scope.opData = parse(res.data);
		console.log('b');
		// applyd3();
	});
})

.directive("operationChart", function() {
	function link(scope, elem, attr) {
		console.log('a');
		function type(d) {
			d.average = +d.average; // convert from string to number
			return d;
		}

		var arr = scope.data;
		console.log(attr);
		console.log(elem);
		console.log(scope);
		console.log(scope.hi);


		var width = 5000,
		    height = 1080;

		var y = d3.scale.linear()
		    .range([height, 0]);

		var chart = d3.select(".chart")
			.attr("width", width)
			.attr("height", height);

		y.domain([0, d3.max(arr, function(d) { return d.average; })]);

		var barWidth = width / arr.length;

		var bar = chart.selectAll("g")
		  	.data(arr)
		  		.enter().append("g")
		  	.attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

		bar.append("rect")
			.attr("y", function(d) { return y(d.average); })
		  	.attr("height", function(d) { return height - y(d.average); })
		  	.attr("width", barWidth - 1);
	}

	return {
		restrict: "EA",
		template: "<div class='svg-container'><svg class='chart'></svg></div>",
		scope: { hi: '=' },
		link: link
	}
});

//function to parse data into an object with a unique set of operations
function parse(res) {
	//building object with elements as operations
	var obj = {};
	for (var i=0; i<res.length; i++) {
		var operation = res[i].operation;
		var value = res[i].value;

		if (!obj[operation]) {
			obj[operation] = {
				total: value,
				count: 1
			};
		} else {
			obj[operation].total += value;
			obj[operation].count++;
		}
	}

	//computing average of all operations
	for (i in obj) {
		obj[i].average = Math.floor(obj[i].total / obj[i].count);
		obj[i].operation = i;
		arr.push(obj[i]);
	}

	// console.log(arr);
	// console.log(obj);
	return arr;
}

// function applyd3() {
// 	var width = 5000,
// 	    height = 1080;

// 	var y = d3.scale.linear()
// 	    .range([height, 0]);

// 	var chart = d3.select(".chart")
// 		.attr("width", width)
// 		.attr("height", height);

// 	y.domain([0, d3.max(arr, function(d) { return d.average; })]);

// 	var barWidth = width / arr.length;

// 	var bar = chart.selectAll("g")
// 	  	.data(arr)
// 	  		.enter().append("g")
// 	  	.attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

// 	bar.append("rect")
// 		.attr("y", function(d) { return y(d.average); })
// 	  	.attr("height", function(d) { return height - y(d.average); })
// 	  	.attr("width", barWidth - 1);
// }

// function type(d) {
// 	d.average = +d.average; // convert from string to number
// 	return d;
// }