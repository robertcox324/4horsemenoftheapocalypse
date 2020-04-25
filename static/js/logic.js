queue()
    .defer(d3.json, '/stack_overflow/developers_cleaned')
    .await(makeGraphs);

function makeGraphs(error, projectsJson) {
	var stack_overflow_repo = projectsJson;
	var ndx = crossfilter(stack_overflow_repo);

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



    var dev_dim = ndx.dimension(function(d) {return d.DevType.split(";");});
    var GroupByDev = dev_dim.groupAll().reduce(dev_reduceAdd, dev_reduceRemove, reduceInitial).value();
//     hack to make dc.js charts work
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
//     hack to make dc.js charts work
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


    var country_dim = ndx.dimension(function(d) { return d.Country;}, true);
    var yearsCode_dim = ndx.dimension(function(d) { return d.YearsCode;}, true);
    var hobby_dim = ndx.dimension(function(d) { return d.Hobbyist;}, true);
    var jobSat_dim = ndx.dimension(function(d) { return d.JobSat;}, true);
    var jobSeek_dim = ndx.dimension(function(d) { return d.JobSeek;}, true);

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
    
	var pieChart = dc.pieChart("#pie-chart");
//    var sunburstChart = new dc.sunburstChart("#pie-chart");
	var row1Chart = new dc.rowChart("#row-chart");
	var row2Chart = new dc.rowChart("#row2-chart");
	var boxplotChart = new dc.boxPlot("#boxplot-chart");
//	var bubbleChart = dc.rowChart("#bubble-chart");
//	var dataTable = dc.dataTable("#data-chart");
//console.log(JobSatGroup)
//console.log(GroupByDev);

//Charts
var heightOfContainer = 500,
    legendHeight = 100,
    legendY = heightOfContainer - legendHeight;
    pieChart
          .width(1200)
          .height(600)
          .slicesCap(15)
          .innerRadius(120)
          .externalLabels(50)
          .minAngleForLabel(0)
          .externalRadiusPadding(120)
          .drawPaths(true)
          .dimension(dev_dim)
          .group(GroupByDev)
          .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
//          .legend(dc.legend().x(700).y(legendY))

      // example of formatting the legend via svg
       http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
      pieChart.on('pretransition', function(chart) {
          chart.selectAll('.dc-legend-item text')
              .text('')
            .append('tspan')
              .text(function(d) { return d.name; })
            .append('tspan')
              .attr('x', 400)
              .attr('text-anchor', 'end')
              .text(function(d) { return d.data; });
      });

	var number_of_bins = 10
	row1Chart
        .width(1000)
        .height(600)
		.dimension(language_dim)
        .group(GroupByLanguage)
        .ordering(function(d){ return -d.value })
        .rowsCap(number_of_bins)
        .elasticX(true);

    row2Chart
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
//        .tickFormat(d3.format('.1f'))
        .renderDataPoints(true)
        .renderTitle(true)
        .dataWidthPortion(0.5)
        .boldOutlier(true)
        .yAxisLabel("Compensation")
        .xAxisLabel("Satisfied with Job", 0)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .on('renderlet',function(chart){
            chart.selectAll("g.x text")
            .attr('dx', '-10')
            .attr('transform', "rotate(-0)");
        })
        .controlsUseVisibility(true)

//	boxplotChart.renderlet(function(chart){
//        chart.selectAll("g.x text")
//            .attr('transform', "rotate(-65)");
//    });
    dc.renderAll();
}