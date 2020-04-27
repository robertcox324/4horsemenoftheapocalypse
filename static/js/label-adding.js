
// Functions to add x-label & y-label to Row Charts (Unsupported by dc.js)
  var addXLabel = function(chartToUpdate, displayText) {
    var textSelection = chartToUpdate.svg()
              .append("text")
                .attr("class", "x-axis-label")
                .attr("text-anchor", "middle")
                .attr("x", chartToUpdate.width() / 2)
                .attr("y", chartToUpdate.height() - 10)
                .text(displayText);
    var textDims = textSelection.node().getBBox();
    var chartMargins = chartToUpdate.margins();

    // Dynamically adjust positioning after reading text dimension from DOM
    textSelection
        .attr("x", chartMargins.left + (chartToUpdate.width()
          - chartMargins.left - chartMargins.right) / 2)
        .attr("y", chartToUpdate.height() - Math.ceil(textDims.height) / 2);
  };
  var addYLabel = function(chartToUpdate, displayText) {
    var textSelection = chartToUpdate.svg()
              .append("text")
                .attr("class", "y-axis-label")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -chartToUpdate.height() / 2)
                .attr("y", 20)
                .text(displayText);
    var textDims = textSelection.node().getBBox();
    var chartMargins = chartToUpdate.margins();

    // Dynamically adjust positioning after reading text dimension from DOM
    textSelection
        .attr("x", -chartMargins.top - (chartToUpdate.height()
          - chartMargins.top - chartMargins.bottom) / 2)
        .attr("y", Math.max(Math.ceil(textDims.height), chartMargins.left
          - Math.ceil(textDims.height) - 5));
  };