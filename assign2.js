
document.addEventListener("DOMContentLoaded", function() {
    // Parse the Data
    d3.csv("data/set4.csv", function (data) {
    data.forEach(function(d) {
        Object.keys(d).forEach(function(key) {
            if(key !== 'year') {
                d[key] = parseInt(d[key].replace(/,/g, ''));
            }
        });
    });

    var maxData = data;

    var selectedCountries = ["Germany", "France", "Italy", "Spain", "Sweden", "Greece"];

    // Filter data for selected countries
    var filteredData = data.map(function(d) {
        var newData = { year: d.year };

        selectedCountries.forEach(function(country) {
            newData[country] = d[country];
        });

        var otherCountriesSum = 0;
        Object.keys(d).forEach(function(key) {
            if (key !== 'year' && !selectedCountries.includes(key)) {
                otherCountriesSum += d[key];
            }
        });
        
        // Add the sum of other countries as 'Other' variable
        newData.Other = otherCountriesSum;

        return newData;
    });

    data = filteredData;

    console.log(filteredData)

    // set the dimensions and margins of the graph
    var margin = { top: 60, right: 250, bottom: 100, left: 200 },
        width = 1300 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
        .select(".chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //////////
    // GENERAL //
    //////////
    var keys = Object.keys(data[0]).slice(1);

    // color palette
    // Define a custom color scheme with darker shades


    // Update the color scale with the custom color scheme
    var color = d3.scaleOrdinal().domain(keys).range(d3.schemeCategory10);


    //stack the data?
    var stackedData = d3.stack().keys(keys)(data);

    console.log(stackedData)

  //////////
  // AXIS //
  //////////

    // Add X axis
    var x = d3
        .scaleLinear()
        .domain(
            d3.extent(data, function (d) {
                return d.year;
            })
        )
        .range([0, width]);

    var xAxis = svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(10));

    // Add X axis label:
    svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 40)
        .text("Time (year)");

    // Add Y axis label:
    svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", -80)
        .attr("y", -10)
        .text("Total value")
        .attr("text-anchor", "start");

    var maxSum = d3.max(maxData, function(d) {
        var sum = 0;
        Object.keys(d).forEach(function(key) {
            if(key !== 'year') {
                sum += d[key];
            }
        });
        return sum;
    });

    // Add Y axis
    var y = d3.scaleLinear().domain([0, maxSum]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

  //////////
  // BRUSHING AND CHART //
  //////////

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg
        .append("defs")
        .append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

    // Create the scatter variable: where both the circles and the brush take place
    var areaChart = svg.append("g").attr("clip-path", "url(#clip)");

    // Area generator
    var area = d3
        .area()
        .x(function (d) {
            return x(d.data.year);
        })
        .y0(function (d) {
            return y(d[0]);
        })
        .y1(function (d) {
            return y(d[1]);
        });

    var tooltip = d3.select(".chart")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ddd")
        .style("padding", "8px")
        .style("border-radius", "5px");

    // Show the areas
    areaChart
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", function (d) {
            return "myArea " + d.key;
        })
        .style("fill", function (d) {
            return color(d.key);
        })
        .attr("d", area)
        .style("cursor", "default")
        .on("mouseover", function(d) { highlight(d.key); })
        .on("mouseleave", function(d) {noHighlight(d.key)})
        .on("mousemove", function(d) {
            var mouseX = d3.mouse(this)[0]; // Get mouse x-coordinate relative to the SVG container
            var yearValue = Math.round(x.invert(mouseX)); // Convert mouse x-coordinate to year value
            var mouseY = d3.mouse(this)[1]; // Get mouse y-coordinate relative to the SVG container
            var totalValue = d3.sum(stackedData, function(countryData) {
            return countryData[yearValue - data[0].year][1] - countryData[yearValue - data[0].year][0];
        });
            
            var value = d[yearValue - data[0].year][1] - d[yearValue - data[0].year][0];
            var tooltipHTML = "<div class='tooltip-content'>";
            tooltipHTML += "<strong>Year:</strong> " + yearValue + "<br/>";
            tooltipHTML += "<strong>" + d.key + ":</strong> " + value + "<br/>";
            tooltipHTML += "<strong>The whole EU:</strong> " + totalValue + "<br/>";
            tooltipHTML += "<div class='pie-chart'></div></div>";

            tooltip.html(tooltipHTML)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY + 10) + "px")
                .style("cursor", "default")
                .style("opacity", 0.9)
                .style("pointer-events", "none");
            
                var hoveredCountry = d.key;
                drawPieChart(value, ".pie-chart", hoveredCountry, totalValue);
        });

  //////////
  // HIGHLIGHT GROUP //
  //////////

    // What to do when one group is hovered
    var highlight = function (d) {
        // reduce opacity of all groups with transition
        d3.selectAll(".myArea")
            .transition()
            .duration(200)
            .style("opacity", 0.1);

        // expect the one that is hovered
        d3.select("." + d)
            .transition()
            .duration(200)
            .style("opacity", 1);
    };

    // And when it is not hovered anymore
    var noHighlight = function (d) {
        // reset opacity of all groups with transition
        d3.selectAll(".myArea")
            .transition()
            .duration(200)
            .style("opacity", 1);
    };


  //////////
  // LEGEND //
  //////////

    // Add title above the chart
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2) - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .style("font-weight", "bold")
        .text("Contributors to Immigrant Acceptance in EU");


    // Add one dot in the legend for each name.
    var size = 20;
    svg
        .selectAll("mydots")
        .data(keys)
        .enter()
        .append("rect")
        .attr("x", width*1.05)
        .attr("y", function (d, i) {
            return 10 + i * (size + 5);
        })
        .attr("width", size)
        .attr("height", size)
        .style("cursor", "default")
        .style("fill", function (d) {
            return color(d);
        })
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight);

    // Add one dot in the legend for each name.
    svg
        .selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", width*1.05 + size*1.2)
        .attr("y", function (d, i) {
            return 15 + i * (size + 5) + size / 2;
        }) 
        .style("fill", function (d) {
            return color(d);
        })
        .text(function (d) {
            return d;
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("cursor", "default")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight);

        // Hide tooltip on mouseout
    svg.on("mouseout", function() {
        tooltip.style("opacity", 0);
    });

function drawPieChart(hoveredValue, selector, country, totalValue) {

    var pieData = [{ country: country, value: hoveredValue }, { country: "Others", value: totalValue - hoveredValue }];

    // Define pie chart parameters
    var radius = 50;
    var pie = d3.pie().value(function(d) { return d.value; });
    var arc = d3.arc().innerRadius(0).outerRadius(radius);

    // Create SVG for pie chart
    var svg = d3.select(selector)
        .append("svg")
        .attr("width", radius * 2)
        .attr("height", radius * 2)
        .append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")");

    // Create pie slices
    var arcs = svg.selectAll("arc")
        .data(pie(pieData))
        .enter()
        .append("g")
        .attr("class", "arc");

    // Fill slices with color
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", function(d, i) {
            if (d.data.country === "Others") {
                return "#CCCCCC"; 
            } else {
                return color(d.data.country); 
            }
        });
    }

});
});