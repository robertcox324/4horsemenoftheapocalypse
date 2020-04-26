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

function apply_resizing(chart, adjustX, adjustY, onresize) {
    if (resizeMode.toLowerCase() === 'viewbox') {
        chart
            .width(1000)
            .height(600)
            .useViewBoxResizing(true);
        d3.select(chart.anchor()).classed('fullsize', true);
    } else {
        adjustX = adjustX || 0;
        adjustY = adjustY || adjustX || 0;
        chart
            .width(window.innerWidth - innerWidth/2)
            .height(window.innerHeight - innerHeight/2);
        window.onresize = function () {
            if (onresize) {
                onresize(chart);
            }
            chart
                .width(window.innerWidth - window.innerWidth/2)
                .height(window.innerHeight - window.innerHeight/2)
//                .x((dc.chart.x(window.innerWidth - window.innerWidth/2-windows.innerWidth/4)))
//                .y(dc.chart.y(window.innerHeight - window.innerHeight/2))

//            chart.legend(dc.legend().x(window.innerWidth-window.innerWidth/2))

            if (chart.rescale) {
                chart.rescale();
            }
            chart.redraw();
        };
    }
}

function apply_resizing_languageBar(chart, adjustX, adjustY, onresize) {
    if (resizeMode.toLowerCase() === 'viewbox') {
        chart
            .width(600)
            .height(400)
            .useViewBoxResizing(true);
        d3.select(chart.anchor()).classed('fullsize', true);
    } else {
        adjustX = adjustX || 0;
        adjustY = adjustY || adjustX || 0;
        chart
            .width(window.innerWidth - innerWidth/2)
            .height(window.innerHeight - innerHeight/2);
        window.onresize = function () {
            if (onresize) {
                onresize(chart);
            }
            chart
                .width(window.innerWidth - window.innerWidth/2)
                .height(window.innerHeight - window.innerHeight/2)

//            chart.legend(dc.legend().x(window.innerWidth-window.innerWidth/2))

            if (chart.rescale) {
                chart.rescale();
            }
            chart.redraw();
        };
    }
}

function apply_resizing_salaryBar(chart, adjustX, adjustY, onresize) {
    if (resizeMode.toLowerCase() === 'viewbox') {
        chart
            .width(600)
            .height(400)
            .useViewBoxResizing(true);
        d3.select(chart.anchor()).classed('fullsize', true);
    } else {
        adjustX = adjustX || 0;
        adjustY = adjustY || adjustX || 0;
        chart
            .width(window.innerWidth - innerWidth/2)
            .height(window.innerHeight - innerHeight/2);
        window.onresize = function () {
            if (onresize) {
                onresize(chart);
            }
            chart
                .width(window.innerWidth - window.innerWidth/2)
                .height(window.innerHeight - window.innerHeight/2)

//            chart.legend(dc.legend().x(window.innerWidth-window.innerWidth/2))

            if (chart.rescale) {
                chart.rescale();
            }
            chart.redraw();
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
