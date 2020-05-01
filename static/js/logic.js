queue()
    .defer(d3.json, '/stack_overflow/developers_cleaned')
    .await(makeGraphs);


function makeGraphs(error, projectsJson) {
	var stack_overflow_repo = projectsJson;
	var ndx = crossfilter(stack_overflow_repo);
	var all = ndx.groupAll();

// These functions work with array elements only. The aim is to find the number of the occurrence of each element in array. Below is the old code that is needed with earlier versions of crossfilter.
//    function lan_reduceAdd(p, v) {
//        v.LanguageWorkedWith.split(";").forEach (function(val, idx) {
//        p[val] = (p[val] || 0) + 1; //increment counts
//      });
//      return p;
//    }
//
//    function lan_reduceRemove(p, v) {
//        v.LanguageWorkedWith.split(";").forEach (function(val, idx) {
//        p[val] = (p[val] || 0) - 1; //decrement counts
//      });
////      console.log(p);
//      return p;
//    }
//
//    function dev_reduceAdd(p, v) {
////        console.log(v.DevType.split(";"));
//        v.DevType.split(";").forEach (function(val, idx) {
//        p[val] = (p[val] || 0) + 1; //increment counts
//      });
////      console.log(p);
//      return p;
//    }
//
//    function dev_reduceRemove(p, v) {
//        v.DevType.split(";").forEach (function(val, idx) {
//        p[val] = (p[val] || 0) - 1; //decrement counts
//      });
//      return p;
//    }
//
//    function reduceInitial() {
//        return {};
//    }


//    Some of the data are in string format where elements separated from each other with ";". We have to split them at each occurence of ";" and feed them to rediuce_add and reduceRemove functions
    var dev_dim = ndx.dimension(function(d) {return d.DevType}, true);
    var GroupByDev = dev_dim.group()

     var language_dim = ndx.dimension(function(d){ return d.LanguageWorkedWith}, true);
     var GroupByLanguage = language_dim.group();

// Creating crossfilter dimensions for  columns of interest in our DataFrame
    var country_dim = ndx.dimension(function(d) { return d.Country;});
    var jobSat_dim = ndx.dimension(function(d) { return d.JobSat;});


// Creating compensation ranges
    var compensation_dim = ndx.dimension(function(d) {
        if (d.ConvertedComp >= 140000) return "140K +";
        else if (d.ConvertedComp > 90000) return "90K +";
        else if (d.ConvertedComp > 60000) return "60K +";
        else if (d.ConvertedComp > 40000) return "40K +";
        else if (d.ConvertedComp > 20000) return "20K +";
        else return "Very Low";});


//    Grouping values
    var GroupByJobSat = jobSat_dim.group()
	    .reduceCount(function (d) {return d.JobSat;});
	var GroupByComp = compensation_dim.group()
	    .reduceCount(function (d) {return d.ConvertedComp;});


	let JobSatGroup = jobSat_dim.group().reduce(
        function (p, v) {
            // Retrieve the data value, if not Infinity or null add it.
            let dv = v.ConvertedComp;
            if (dv != Infinity && dv != null) p.splice(d3.bisectLeft(p, dv), 0, dv);
                return p;
        },
        function (p, v) {
            // Retrieve the data value, if not Infinity or null remove it.
            let dv = v.ConvertedComp;
            if (dv != Infinity && dv != null) p.splice(d3.bisectLeft(p, dv), 1);
            return p;
        },
            function () {
                return [];
            }
    );
// Adding countries to dropdown filter menu
    var select = new dc.selectMenu("#select1")
        .dimension(country_dim)
        .group(country_dim.group())
        .controlsUseVisibility(true)
        .title(d=>d.key);


//    Chart elemtns created
	var pieChart = new dc.pieChart("#pie-chart");
	var languageChart = new dc.rowChart("#row-chart1");
	var salaryChart = new dc.rowChart("#row-chart2");
	var boxplotChart = new dc.boxPlot("#boxplot-chart");

console.log(all);
console.log(GroupByDev);
console.log(GroupByLanguage);
//Charts
var heightOfContainer = 500,
    legendHeight = 100,
    legendY = heightOfContainer - legendHeight;
    var adjustX = 20, adjustY = 40;
    pieChart
          .width(1000)
          .height(600)
          .slicesCap(15)
          .innerRadius(120)
          .externalLabels(70)
          .minAngleForLabel(0)
          .externalRadiusPadding(100)
          .drawPaths(true)
          .dimension(dev_dim)
          .group(GroupByDev)
//          .legend(dc.legend().x(900).y(10).itemHeight(13).gap(5).autoItemWidth(true))
//          .legend(dc.legend().x(700).y(legendY))
//    apply_resizing(pieChart, adjustX, adjustY);

      // example of formatting the legend via svg. This is not used since it behaves funky when the chart is resized
       http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
      pieChart.on('pretransition', function(chart) {
          chart.selectAll('.dc-legend-item text')
              .text('')
            .append('tspan')
              .text(function(d) { return d.name; })
            .append('tspan')
              .attr('x', 300)
              .attr('text-anchor', 'end')
              .text(function(d) { return d.data; });
      });


	var number_of_bins = 10
	languageChart
        .width(1000)
        .height(600)
		.dimension(language_dim)
		.group(GroupByLanguage)
        .ordering(function(d){ return -d.value })
        .rowsCap(number_of_bins)
        .elasticX(true)


    salaryChart
        .width(1000)
        .height(600)
		.dimension(compensation_dim)
        .group(GroupByComp)
        .ordering(function(d){ return -d.value })
        .elasticX(true);


     boxplotChart
        .width(1000)
        .boxWidth(10)
        .height(600)
        .margins({top: 10, right: 10, bottom: 50, left: 60})
        .dimension(jobSat_dim)
        .group(JobSatGroup)
        .tickFormat(d3.format('.1f'))
        .renderDataPoints(true)
        .renderTitle(true)
        .dataWidthPortion(0.5)
        .boldOutlier(true)
        .yAxisLabel("Compensation")
        .xAxisLabel("Satisfied with Job", 0)
        .elasticY(true)
        .yAxisPadding('10%')
        .renderHorizontalGridLines(true)
        .on('renderlet',function(chart){
            chart.selectAll("g.x text")
            .attr('dx', '0')
            .attr('transform', "rotate(-0)");
        })
        .controlsUseVisibility(true)

        apply_resizing(pieChart, languageChart, salaryChart, boxplotChart, adjustX, adjustY);

//Below function adds labels to Row charts but does not work when charts being resized. Unfortunately there is no default labeling functions for Row charts in dc.js
//  languageChart.on("postRender", function(chart) {
//        addXLabel(chart, "# of Developers");
//        addYLabel(chart, "Top 10 Languages");
//  });
//    salaryChart.on("postRender", function(chart) {
//        addXLabel(chart, "# of Developers in each range");
//        addYLabel(chart, "Range of Salaries");
//  });


    dc.renderAll();




}