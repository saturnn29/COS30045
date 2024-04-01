document.addEventListener("DOMContentLoaded", function() {
  d3.csv("data/set4.csv", function (data) {
    // Format the data
    data.forEach(function(d) {
      Object.keys(d).forEach(function(key) {
        if(key !== 'year') {
          d[key] = parseInt(d[key].replace(/,/g, ''));
        }
      });
    });

    // Array of the top countries
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

    // set the dimensions and margins of the graph
    var margin = { top: 60, right: 250, bottom: 100, left: 200 },
      width = 1300 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(".linechart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define x scale for the line chart
    var x = d3.scaleBand()
      .domain(filteredData.map(function(d) { return d.year; }))
      .range([0, width])
      .padding(0.1);

    // Define y scale for the line chart
    var y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, function(d) {
        var sum = 0;
        Object.keys(d).forEach(function(key) {
          if (key !== 'year') {
            sum += d[key];
          }
        });
        return sum;
      })])
      .nice()
      .range([height, 0]);

    // Create a line generator
    var line = d3.line()
      .x(function(d) { 
        return x(d.year) + x.bandwidth() / 2; 
      })
      .y(function(d) { 
        var sum = 0;
        // Calculate the total sum of values for each year
        Object.keys(d).forEach(function(key) {
          if (key !== 'year') {
            sum += d[key];
          }
        });
        return y(sum); 
      });

    // Add x axis
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add y axis
    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));

    // Draw the line
    svg.append("path")
      .datum(filteredData)
      .attr("class", "line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 3)
      .attr("d", line)
      .style("stroke-dasharray", function() { return this.getTotalLength() + " " + this.getTotalLength(); })
      .style("stroke-dashoffset", function() { return this.getTotalLength(); })
      .transition() 
      .duration(1500) 
      .ease(d3.easeLinear) 
      .style("stroke-dashoffset", 0); 

    // Add line chart title
    svg.append("text")
      .attr("class", "line-chart-title")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .text("Number of Immigrants in All EU Countries Each Year");

    // Add X axis label:
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + 40)
      .text("Time (year)");

    // Add Y axis label:
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", -10)
      .attr("y", -20)
      .text("Total Value")
      .attr("text-anchor", "start");

    // Add points and tooltips
    svg.selectAll(".dot")
      .data(filteredData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", function(d) { return x(d.year) + x.bandwidth() / 2; })
      .attr("cy", function(d) {
        var sum = 0;
        Object.keys(d).forEach(function(key) {
          if (key !== 'year') {
            sum += d[key];
          }
        });
        return y(sum);
      })
      .attr("r", 5)
      .style("fill", "steelblue")
      .on("mouseover", function(d) {
        // Increase the radius of the hovered circle with transition
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 10);
      
        // Show tooltip
        tooltip.transition()
          .style("opacity", .9);
      
        // Tooltip content
        const totalValue = calculateTotalValue(d);
        let tooltipHtml = getTooltipHtml(d.year, totalValue);
      
        tooltip.html(tooltipHtml)
          .style("left", (d3.event.pageX + 10) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .style("pointer-events", "none");
      })
      .on("mouseout", function() {
        // Reset the radius of the circle on mouseout with transition
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 5);
        // Hide tooltip
        tooltip.transition()
          .style("opacity", 0)
        // Remove the vertical line
        verticalLine.style("opacity", 0);
      })
      .on("mousemove", function() {
        // Get the mouse position
        var mouseX = d3.mouse(this)[0];
        var mouseY = d3.mouse(this)[1];

        // Update the vertical line position
        verticalLine
          .style("opacity", 1)
          .attr("x1", mouseX)
          .attr("x2", mouseX)
          .attr("y1", y(calculateTotalValue(d3.event.target.__data__)))
          .attr("y2", height);
      });

    // Function to calculate total value
    function calculateTotalValue(d) {
      var sum = 0;
      Object.keys(d).forEach(function(key) {
        if (key !== 'year') {
          sum += d[key];
        }
      });
      return sum;
    }

    // Append tooltip
    var tooltip = d3.select(".linechart")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("padding", "8px")
      .style("border-radius", "5px")
      .style("cursor", 'default');

    // Append the vertical line
    var verticalLine = svg.append("line")
      .attr("class", "vertical-line")
      .style("stroke", "black")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "5, 5")
      .style("opacity", 0);
  });

  function getTooltipHtml(year, totalValue) {
    let tooltipHtml = `<b>Total Value:</b> ${totalValue}`;
  
    switch (year) {
      case '2015':
        tooltipHtml += `<span style="color: gray;"><br/>War-torn regions’ instability in the Middle East <br/> drove a massive migrant influx seeking refuge in the EU compared to 2014</span>`;
        break;
      case '2020':
        tooltipHtml += `<span style="color: gray;"><br>The number of migrants experienced a tremendous decline <br/> due to restricted immigration policies in response to the COVID-19 pandemic</span>`;
        break;
      case '2023':
        tooltipHtml += `<span style="color: gray;"><br/>The new rise was driven by factors such as <br/> eased pandemic restrictions, economic recovery, <br/> Russian-Ukraine conflicts, and the impact of climate change</span>`;
        break;
      default:
        break;
    }
  
    return tooltipHtml;
  }
});