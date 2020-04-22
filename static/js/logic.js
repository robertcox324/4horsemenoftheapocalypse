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
    // hack to make dc.js charts work
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
        console.log(newObject);
      return newObject;
    }

    var dev_dim = ndx.dimension(function(d){ return d.DevType;});
    var GroupByDev = dev_dim.groupAll().reduce(dev_reduceAdd, dev_reduceRemove, reduceInitial).value();
    // hack to make dc.js charts work
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
        console.log(newObject);
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


    console.log(country_dim);



	var GroupByJobSat = jobSat_dim.group()
	    .reduceCount(function (d) {return d.JobSat;});
	var GroupByComp = compensation_dim.group()
	    .reduceCount(function (d) {return d.ConvertedComp;});


	
	
//	var DataDimgroup = DataDim.group()
//	.reduceCount(function(d){return d.COMPANY_STATUS;});
    
	var rowChart = dc.pieChart("#pie-chart");
	var row1Chart = dc.rowChart("#row-chart");
	var row2Chart = dc.rowChart("#row2-chart");
//	var bubbleChart = dc.rowChart("#bubble-chart");
//	var dataTable = dc.dataTable("#data-chart");

	rowChart
        .width(400)
        .height(400)
		.dimension(dev_dim)
        .group(GroupByDev)
		.radius(200)
//		.slicesCap(5)
    .legend(dc.legend());
       
		
//	dataTable
//	.width(960)
//	.height(800)
//
//    .dimension(DataDim)
//    .group(function(d) { return d.COMPANY_NAME;
//     })
//
//    .columns([
//     function(d) { return d.COMPANY_STATUS; },
//     function(d) { return d.COMPANY_CLASS; },
//
//	  function(d) { return d.PAIDUP_CAPITAL; },
//      function(d) { return d.AUTHORIZED_CAPITAL; },
//
//      function(d) { return d.PRINCIPAL_BUSINESS_ACTIVITY; },
//    ])
//    .sortBy(function(d){ return d.PRINCIPAL_BUSINESS_ACTIVITY; })
//    .order(d3.ascending);
//
//
//	bubbleChart
//         .width(700)
//        .height(150)
//		.dimension(pieDim)
//        .group(pieDimType)
//		.xAxis().tickFormat();
		
	row1Chart
        .width(600)
        .height(600)
		.dimension(language_dim)
        .group(GroupByLanguage)
        .ordering(function(d){ return -d.value })
        .elasticX(true);
////		.xAxis().tickFormat(1500);

    row2Chart
        .width(600)
        .height(600)
		.dimension(compensation_dim)
        .group(GroupByComp)
        .ordering(function(d){ return -d.value })
        .elasticX(true);
        	

	
    dc.renderAll();
}