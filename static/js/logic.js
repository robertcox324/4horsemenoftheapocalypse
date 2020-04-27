queue()
    .defer(d3.json, '/stack_overflow/developers_cleaned')
    .await(makeGraphs);

const urlParams = new URLSearchParams(window.location.search),
useCanvas = !!urlParams.get('canvas');

d3.select('#canvas').property('checked', useCanvas).on('change', function() {
    window.location.href = window.location.href.split('?')[0] + (this.checked ? '?canvas=t' : '');
})

function makeGraphs(error, projectsJson) {
	var stack_overflow_repo = projectsJson;
	var ndx = crossfilter(stack_overflow_repo);
// These functions work with array elements only. The aim is to find the number of the occurrence of each element in array
    function lan_reduceAdd(p, v) {
        v.LanguageWorkedWith.split(";").forEach (function(val, idx) {
        p[val] = (p[val] || 0) + 1; //increment counts
      });
      return p;
    }

    function lan_reduceRemove(p, v) {
        v.LanguageWorkedWith.split(";").forEach (function(val, idx) {
        p[val] = (p[val] || 0) - 1; //decrement counts
      });
//      console.log(p);
      return p;
    }

    function dev_reduceAdd(p, v) {
        console.log(v.DevType.split(";"));
        v.DevType.split(";").forEach (function(val, idx) {
        p[val] = (p[val] || 0) + 1; //increment counts
      });
//      console.log(p);
      return p;
    }

    function dev_reduceRemove(p, v) {
        v.DevType.split(";").forEach (function(val, idx) {
        p[val] = (p[val] || 0) - 1; //decrement counts
      });
      return p;
    }

    function reduceInitial() {
        return {};
    }


//    Some of the data are in string format where elements separated from each other with ";". We have to split them at each occurence of ";" and feed them to rediuce_add and reduceRemove functions
    var dev_dim = ndx.dimension(function(d) {return d.DevType.split(";");});
    var GroupByDev = dev_dim.groupAll().reduce(dev_reduceAdd, dev_reduceRemove, reduceInitial).value();
//     hack to make dc.js charts work. Interestingly enough the code above should be all that we needed to Group elements but it won't work without below code
    GroupByDev.all = function() {
        var newObject = [];
        for (var key in this) {
            if (this.hasOwnProperty(key) && key != "all") {
                newObject.push({
                key: key,
                value: this[key]
                });
            }
        }
      return newObject;
    }

     var language_dim = ndx.dimension(function(d){ return d.LanguageWorkedWith.split(";");});
    var GroupByLanguage = language_dim.groupAll().reduce(lan_reduceAdd, lan_reduceRemove, reduceInitial).value();
//     hack to make dc.js charts work. Interestingly enough the code above should be all that we needed to Group elements but it won't work without below code.
    GroupByLanguage.all = function() {
        var newObject = [];
        for (var key in this) {
            if (this.hasOwnProperty(key) && key != "all") {
                newObject.push({
                key: key,
                value: this[key]
                });
            }
        }
//        console.log(newObject);
      return newObject;
    }

// Creating crossfilter dimensions for each column in our DataFrame
    var country_dim = ndx.dimension(function(d) { return d.Country;}, true);
    var yearsCode_dim = ndx.dimension(function(d) { return d.YearsCode;}, true);
    var hobby_dim = ndx.dimension(function(d) { return d.Hobbyist;}, true);
    var jobSat_dim = ndx.dimension(function(d) { return d.JobSat;}, true);
    var jobSeek_dim = ndx.dimension(function(d) { return d.JobSeek;}, true);

// Creating compensation ranges
    var compensation_dim = ndx.dimension(function(d) {
        if (d.ConvertedComp >= 140000) return "140K +";
        else if (d.ConvertedComp > 90000) return "90K +";
        else if (d.ConvertedComp > 60000) return "60K +";
        else if (d.ConvertedComp > 40000) return "40K +";
        else if (d.ConvertedComp > 20000) return "20K +";
        else return "Very Low";}, true);

    var db_dim = ndx.dimension(function(d) {return d.DatabaseWorkedWith;}, true);
    var wbFrame_dim = ndx.dimension(function(d) {return d.WebFrameWorkedWith;}, true);
    var age_dim = ndx.dimension(function(d) {return d.Age;}, true);
    var gender_dim = ndx.dimension(function(d) {return d.Gender;}, true);


    var GroupByJobSat = jobSat_dim.group()
	    .reduceCount(function (d) {return d.JobSat;});
	var GroupByComp = compensation_dim.group()
	    .reduceCount(function (d) {return d.ConvertedComp;});
//    var GroupByCountry = country_dim.group()
//	    .reduceSum(function (d) {return d.Country;});

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




//	var GroupByDev = dev_dim.group()
//        .reduceCount(function (d) {return d.DevType.split(";");});
//    var GroupByLanguage = language_dim.group()
//        .reduceCount(function (d) {return d.LanguageWorkedWith.split(";");})
//    console.log(GroupByLanguage);
	
	
//	var DataDimgroup = DataDim.group()
//	.reduceCount(function(d){return d.COMPANY_STATUS;});

//    Chart elemtns created
	var pieChart = new dc.pieChart("#pie-chart");
	var languageChart = new dc.rowChart("#row-chart1");
	var salaryChart = new dc.rowChart("#row-chart2");
	var boxplotChart = new dc.boxPlot("#boxplot-chart");


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
    apply_resizing(pieChart, adjustX, adjustY);

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
//        .group(GroupByLanguage)
        .ordering(function(d){ return -d.value })
        .rowsCap(number_of_bins)
        .elasticX(true)
//    apply_resizing_languageBar(languageChart, adjustX, adjustY);


    salaryChart
        .width(1000)
        .height(600)
		.dimension(compensation_dim)
        .group(GroupByComp)
        .ordering(function(d){ return -d.value })
        .elasticX(true);
//    apply_resizing_salaryBar(row2Chart, adjustX, adjustY);


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


//  row1Chart.on("postRender", function(chart) {
//        addXLabel(chart, "# of Developers");
//        addYLabel(chart, "Top 10 Languages");
//  });
//    row2Chart.on("postRender", function(chart) {
//        addXLabel(chart, "# of Developers in each range");
//        addYLabel(chart, "Range of Salaries");
//  });


    dc.renderAll();




}