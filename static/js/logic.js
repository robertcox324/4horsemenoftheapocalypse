queue()
    .defer(d3.json, '/stack_overflow/developers_cleaned')
    .await(makeGraphs);

function makeGraphs(error, projectsJson) {
	var stack_overflow_repo = projectsJson;
	var ndx = crossfilter(stack_overflow_repo);

//    function reduceAdd(p, v) {
//        v.tags.forEach (function(val, idx) {
//        p[val] = (p[val] || 0) + 1; //increment counts
//      });
//      return p;
//    }
//
//    function reduceRemove(p, v) {
//        v.tags.forEach (function(val, idx) {
//        p[val] = (p[val] || 0) - 1; //decrement counts
//      });
//      return p;
//    }
//
//    function reduceInitial() {
//        return {};
//    }
//
//    var tags = ndx.dimension(function(d){ return d.LanguageWorkedWith;});
//    var tagsGroup = tags.groupAll().reduce(reduceAdd, reduceRemove, reduceInitial).value();
//    // hack to make dc.js charts work
//    tagsGroup.all = function() {
//        var newObject = [];
//        for (var key in this) {
//            if (this.hasOwnProperty(key) && key != "all") {
//                newObject.push({
//                key: key,
//                value: this[key]
//                });
//            }
//        }
//      return newObject;
//    }

    var country_dim = ndx.dimension(function(d) { return d.Country;});
    var yearsCode_dim = ndx.dimension(function(d) { return d.YearsCode;});
    var hobby_dim = ndx.dimension(function(d) { return d.Hobbyist;});
    var jobSat_dim = ndx.dimension(function(d) { return d.JobSat;});
    var jobSeek_dim = ndx.dimension(function(d) { return d.JobSeek;});
    var language_dim = ndx.dimension(function(d) {return d.LanguageWorkedWith;});
    var db_dim = ndx.dimension(function(d) {return d.DatabaseWorkedWith;});
    var wbFrame_dim = ndx.dimension(function(d) {return d.WebFrameWorkedWith;});
    var age_dim = ndx.dimension(function(d) {return d.Age;});
    var gender_dim = ndx.dimension(function(d) {return d.Gender;});

//    country_dim.forEach((country)=>{
//        console.log(country)});
    console.log(country_dim);

//	var GroupByCountry = country_dim.group()
//	    .reduceCount(function (d) {return d.Country;}).top(10);

	var GroupByJobSat = jobSat_dim.group()
	    .reduceCount(function (d) {return d.JobSat;});
//	var numProjectsByResourceType = pieTypeDim.group()
//	.reduceCount(function(d){return d.AUTHORIZED_CAPITAL;});
//	var pieDimType = pieDim.group()
//	.reduceCount(function(d){return d.COMPANY_CLASS;});
//	var numProjectsByPovertyLevel = rowLevelDim.group()
//	.reduceCount(function(d){return d.PRINCIPAL_BUSINESS_ACTIVITY;});
//	var bubbleDimgroup = bubbleDim.group()
//	.reduceCount(function(d){return d.COMPANY_NAME;});

	
	
//	var DataDimgroup = DataDim.group()
//	.reduceCount(function(d){return d.COMPANY_STATUS;});
    
//	var rowChart = dc.pieChart("#pie-chart");
	var row1Chart = dc.rowChart("#row-chart");
//	var bubbleChart = dc.rowChart("#bubble-chart");
//	var dataTable = dc.dataTable("#data-chart");

//	rowChart
//        .width(400)
//        .height(400)
//		.dimension(pieTypeDim)
//        .group(numProjectsByResourceType)
//		.radius(200)
//		.slicesCap(5)
//    .legend(dc.legend().gap(3));
       
		
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
		.dimension(jobSat_dim)
        .group(GroupByJobSat);
//		.xAxis().tickFormat(1500);
        	

	
    dc.renderAll();
}