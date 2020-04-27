//Skip to content
//Search or jump to…
//
//Pull requests
//Issues
//Marketplace
//Explore
//
//@aydinjalil
//Learn Git and GitHub without any code!
//Using the Hello World guide, you’ll start a branch, write comments, and open a pull request.
//
//
//Code Issues 339 Pull requests 35 Projects 0 Actions Wiki Security 0 Pulse Community
//dc.js/web-src/resizing/dc-resizing.js /
//@kum-deepak kum-deepak rename web -> web-src
//f3f929d on Dec 2, 2019
//44 lines (42 sloc)  1.28 KB
//
//Code navigation is available!
//Navigate your code with ease. Click on function and method calls to jump to their definitions or references in the same repository. Learn more
// 4horsemenenOfTheApocalypse added some functionality to the original code to make all charts responsive
var find_query = function () {
    var _map = window.location.search.substr(1).split('&').map(function (a) {
        return a.split('=');
    }).reduce(function (p, v) {
        if (v.length > 1)
            p[v[0]] = decodeURIComponent(v[1].replace(/\+/g, " "));
        else
            p[v[0]] = true;
        return p;
    }, {});
    return function (field) {
        return _map[field] || null;
    };
}();
var resizeMode = find_query('resize') || 'widhei';

function apply_resizing(pieChart, languageChart, salaryChart, boxplotChart, adjustX, adjustY, onresize) {
    if (resizeMode.toLowerCase() === 'viewbox') {
        pieChart
            .width(1000)
            .height(600)
            .useViewBoxResizing(true);
        d3.select(pieChart.anchor()).classed('fullsize', true);

        languageChart
            .width(1000)
            .height(600)
            .useViewBoxResizing(true);
        d3.select(languageChart.anchor()).classed('fullsize', true);

        salaryChart
            .width(1000)
            .height(600)
            .useViewBoxResizing(true);
        d3.select(salaryChart.anchor()).classed('fullsize', true);

        boxplotChart
            .width(1000)
            .height(600)
            .useViewBoxResizing(true);
        d3.select(boxplotChart.anchor()).classed('fullsize', true);
    } else {
        adjustX = adjustX || 0;
        adjustY = adjustY || adjustX || 0;
        pieChart
            .width(window.innerWidth - window.innerWidth/2)
        languageChart
            .width(window.innerWidth - window.innerWidth/2)
        salaryChart
            .width(window.innerWidth - window.innerWidth/2)
        boxplotChart
            .width(window.innerWidth - window.innerWidth/2)
//            .height(window.innerHeight - window.innerHeight/2 - adjustY);
        window.onresize = function () {
            if (onresize) {
                onresize(pieChart);
                onresize(languageChart);
                onresize(salaryChart);
                onresize(boxplotChart);
            }
            pieChart
                .width(window.innerWidth - window.innerWidth/2)
            languageChart
                .width(window.innerWidth - window.innerWidth/2)
            salaryChart
                .width(window.innerWidth - window.innerWidth/2)
            boxplotChart
                .width(window.innerWidth - window.innerWidth/2)
//                .height(window.innerHeight - window.innerHeight/2 - adjustY);
//                .x((dc.chart.x(window.innerWidth - window.innerWidth/2-windows.innerWidth/4)))
//                .y(dc.chart.y(window.innerHeight - window.innerHeight/2))

//            chart.legend(dc.legend().x(window.innerWidth-window.innerWidth/2))

            if (pieChart.rescale) {
                pieChart.rescale();
            }
            pieChart.redraw();

            if (languageChart.rescale) {
                languageChart.rescale();
            }
            languageChart.redraw();

            if (salaryChart.rescale) {
                salaryChart.rescale();
            }
            salaryChart.redraw();

            if (boxplotChart.rescale) {
                boxplotChart.rescale();
            }
            boxplotChart.redraw();

        };
    }
}






//© 2020 GitHub, Inc.
//Terms
//Privacy
//Security
//Status
//Help
//Contact GitHub
//Pricing
//API
//Training
//Blog
//About
