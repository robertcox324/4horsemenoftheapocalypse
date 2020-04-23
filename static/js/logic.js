queue()
    .defer(d3.json, '/stack_overflow/developers_cleaned')
    .await(makeGraphs);

function makeGraphs(error, projectsJson) {
	var stack_overflow_repo = projectsJson;
	var ndx = crossfilter(stack_overflow_repo);

    function lan_reduceAdd(p, v) {
        v.LanguageWorkedWith.forEach (function(val, idx) {
        p[val] = (p[val] || 0) + 1; //increment counts
      });
      return p;
    }

    function lan_reduceRemove(p, v) {
        v.LanguageWorkedWith.forEach (function(val, idx) {
        p[val] = (p[val] || 0) - 1; //decrement counts
      });
//      console.log(p);
      return p;
    }

    function dev_reduceAdd(p, v) {
        v.DevType.forEach (function(val, idx) {
        p[val] = (p[val] || 0) + 1; //increment counts
      });
      return p;
    }

    function dev_reduceRemove(p, v) {
        v.DevType.forEach (function(val, idx) {
        p[val] = (p[val] || 0) - 1; //decrement counts
      });
      return p;
    }

    function reduceInitial() {
        return {};
    }

    var language_dim = ndx.dimension(function(d){ return d.LanguageWorkedWith;});
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
      return newObject;
    }

    var dev_dim = ndx.dimension(function(d) { return d.DevType});
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
    
//	var rowChart = dc.pieChart("#pie-chart");
    var sunburstChart = new dc.sunburstChart("#pie-chart");
	var row1Chart = new dc.rowChart("#row-chart");
	var row2Chart = new dc.rowChart("#row2-chart");
	var boxplotChart = new dc.boxPlot("#boxplot-chart");
//	var bubbleChart = dc.rowChart("#bubble-chart");
//	var dataTable = dc.dataTable("#data-chart");
console.log(JobSatGroup)
console.log(GroupByDev);

//Charts
	sunburstChart
        .width(600)
        .height(600)
		.dimension(dev_dim)
        .group(GroupByDev)
		.radius(350)
//		.slicesCap(5)
    .legend(dc.legend());
       

	var number_of_bins = 10
	row1Chart
        .width(600)
        .height(600)
		.dimension(language_dim)
        .group(GroupByLanguage)
        .ordering(function(d){ return -d.value })
        .rowsCap(10)
        .elasticX(true);

    row2Chart
        .width(600)
        .height(600)
		.dimension(compensation_dim)
        .group(GroupByComp)
        .ordering(function(d){ return -d.value })
        .elasticX(true);

     boxplotChart
        .width(600)
        .height(600)
        .dimension(jobSat_dim)
        .group(JobSatGroup)
        .tickFormat(d3.format('.1f'))
        .renderDataPoints(true)
        .renderTitle(true)
        .dataWidthPortion(0.5)
        .boldOutlier(true)
        .yAxisLabel("Compensation")
        .xAxisLabel("Satisfied with Job", 0)
        .elasticY(true);

	
    dc.renderAll();
}