function init() {
    // Initialize the map
    // [50, -0.1] are the latitude and longitude
    // 4 is the zoom
    // mapid is the id of the div where the map will appear
    var map = L
    .map('mapid')
    .setView([48.8566, 2.3522], 5);

    // Tile type: openstreetmap normal
    var openstreetmap = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 18
    })

    

    const countryVisualizations = {
        'spain': spainVisualization,
        'italy': italyVisualization,
        'greece': greeceVisualization,
        'bulgaria': bulgariaVisualization,
        'hunagry': hungaryVisualization,
        'albania': albaniaVisualization,
        'kosovo': kosovoVisualization,
        'montenegro': montenegroVisualization,
        'malta': montenegroVisualization
    };

    

    function spainVisualization(coordinate) {
        var spainMarker = L.circleMarker([coordinate.lat, coordinate.lon], {
            color: 'orange',
            fillColor: 'orange',
            fillOpacity: 0.5,
            radius: 20
        }).addTo(map);

        spainMarker.on('click', function() {
            var popupContent = '<div id="popup-chart-spain" style="width: 200px; height: 200px;"></div>';
            var popup = spainMarker.bindPopup(popupContent).openPopup();

            d3.csv("to_eu16-23/to_spain2016.csv").then(function(data) {
                createVisualization("#popup-chart-spain", data, "By land", "By sea");
            });
        });
    }

    function italyVisualization(coordinate) {
        var italyMarker = L.circleMarker([coordinate.lat, coordinate.lon], {
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.5,
            radius: 20
        }).addTo(map);

        italyMarker.on('click', function() {
            var popupContent = '<div id="popup-chart-italy" style="width: 200px; height: 200px;"></div>';
            var popup = italyMarker.bindPopup(popupContent).openPopup();

            d3.csv("to_eu16-23/to_italy2016.csv").then(function(data) {
                createVisualization("#popup-chart-italy", data, "By land", "By sea");
            });
        });
    }

    function greeceVisualization(coordinate) {
        var greeceMarker = L.circleMarker([coordinate.lat, coordinate.lon], {
            color: 'orange',
            fillColor: 'orange',
            fillOpacity: 0.5,
            radius: 20
        }).addTo(map);

        greeceMarker.on('click', function() {
            var popupContent = '<div id="popup-chart-greece" style="width: 200px; height: 200px;"></div>';
            var popup = greeceMarker.bindPopup(popupContent).openPopup();

            d3.csv("to_eu16-23/to_greece2016.csv").then(function(data) {
                createVisualization("#popup-chart-greece", data, "By land", "By sea");
            });
        });
    }

    function bulgariaVisualization(coordinate) {
        var greeceMarker = L.circleMarker([coordinate.lat, coordinate.lon], {
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.5,
            radius: 20
        }).addTo(map);

        greeceMarker.on('click', function() {
            var popupContent = '<div id="popup-chart-bulgaria" style="width: 200px; height: 200px;"></div>';
            var popup = greeceMarker.bindPopup(popupContent).openPopup();

            d3.csv("to_eu16-23/to_bulgaria16.csv").then(function(data) {
                createVisualization("#popup-chart-bulgaria", data, "By land", "By sea");
            });
        });
    }

    function hungaryVisualization(coordinate) {
        var greeceMarker = L.circleMarker([coordinate.lat, coordinate.lon], {
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.5,
            radius: 20
        }).addTo(map);

        greeceMarker.on('click', function() {
            var popupContent = '<div id="popup-chart-hungary" style="width: 200px; height: 200px;"></div>';
            var popup = greeceMarker.bindPopup(popupContent).openPopup();

            d3.csv("to_eu16-23/to_hungary16.csv").then(function(data) {
                createVisualization("#popup-chart-hunagry", data, "By land", "By sea");
            });
        });
    }

    function albaniaVisualization(coordinate) {
        var greeceMarker = L.circleMarker([coordinate.lat, coordinate.lon], {
            color: 'orange',
            fillColor: 'orange',
            fillOpacity: 0.5,
            radius: 20
        }).addTo(map);

        greeceMarker.on('click', function() {
            var popupContent = '<div id="popup-chart-albania" style="width: 200px; height: 200px;"></div>';
            var popup = greeceMarker.bindPopup(popupContent).openPopup();

            d3.csv("to_eu16-23/to_albania16.csv").then(function(data) {
                createVisualization("#popup-chart-albania", data, "By land", "By sea");
            });
        });
    }

    function maltaVisualization(coordinate) {
        var greeceMarker = L.circleMarker([coordinate.lat, coordinate.lon], {
            color: 'orange',
            fillColor: 'orange',
            fillOpacity: 0.5,
            radius: 20
        }).addTo(map);

        greeceMarker.on('click', function() {
            var popupContent = '<div id="popup-chart-malta" style="width: 200px; height: 200px;"></div>';
            var popup = greeceMarker.bindPopup(popupContent).openPopup();

            d3.csv("to_eu16-23/to_malta16.csv").then(function(data) {
                createVisualization("#popup-chart-malta", data, "By land", "By sea");
            });
        });
    }

    function kosovoVisualization(coordinate) {
        var greeceMarker = L.circleMarker([coordinate.lat, coordinate.lon], {
            color: 'orange',
            fillColor: 'orange',
            fillOpacity: 0.5,
            radius: 20
        }).addTo(map);

        greeceMarker.on('click', function() {
            var popupContent = '<div id="popup-chart-kosovo" style="width: 200px; height: 200px;"></div>';
            var popup = greeceMarker.bindPopup(popupContent).openPopup();

            d3.csv("to_eu16-23/to_kosovo16.csv").then(function(data) {
                createVisualization("#popup-chart-kosovo", data, "By land", "By sea");
            });
        });
    }

    function montenegroVisualization(coordinate) {
        var greeceMarker = L.circleMarker([coordinate.lat, coordinate.lon], {
            color: 'orange',
            fillColor: 'orange',
            fillOpacity: 0.5,
            radius: 20
        }).addTo(map);

        greeceMarker.on('click', function() {
            var popupContent = '<div id="popup-chart-montenegro" style="width: 200px; height: 200px;"></div>';
            var popup = greeceMarker.bindPopup(popupContent).openPopup();

            d3.csv("to_eu16-23/to_montenegro16.csv").then(function(data) {
                createVisualization("#popup-chart-montenegro", data, "By land", "By sea");
            });
        });
    }

    function createVisualization(containerSelector, data, line1Label, line2Label) {
        let w = 200;
        let h = 200;

        let margin = { top: 20, right: 20, bottom: 30, left: 50 };
        let width = w - margin.left - margin.right;
        let height = h - margin.top - margin.bottom;

        let x = d3.scaleLinear()
            .domain([1, 12])
            .range([0, width]);

        let y = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d['by land'], d['by sea']))])
            .range([height, 0]);

        let xAxis = d3.axisBottom(x)
            .ticks(12)
            .tickFormat(d => d);

        let yAxis = d3.axisLeft(y);

        let svg = d3.select(containerSelector)
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", d3.line()
                .x(d => x(+d.month))
                .y(d => y(+d['by land']))
            )
            .style("fill", "none")
            .style("stroke", "steelblue")
            .style("stroke-width", 2);

        svg.append("path")
            .datum(data)
            .attr("class", "line line2")
            .attr("d", d3.line()
                .x(d => x(+d.month))
                .y(d => y(+d['by sea']))
            )
            .style("fill", "none")
            .style("stroke", "red")
            .style("stroke-width", 2);

        // Dots for "by land" line
        svg.selectAll(".dot1")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot dot1")
            .attr("cx", d => x(+d.month))
            .attr("cy", d => y(+d['by land']))
            .attr("r", 3)
            .style("fill", "steelblue")
            .on("mouseover", function(event, d) {
                let value = d['by land'];
                handleMouseover(this, value, svg, x, y);
            })
            .on("mouseout", function() {
                handleMouseout(svg);
            });

        // Dots for "by sea" line
        svg.selectAll(".dot2")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot dot2")
            .attr("cx", d => x(+d.month))
            .attr("cy", d => y(+d['by sea']))
            .attr("r", 3)
            .style("fill", "red")
            .on("mouseover", function(event, d) {
                let value = d['by sea'];
                handleMouseover(this, value, svg, x, y);
            })
            .on("mouseout", function() {
                handleMouseout(svg);
            });

        let legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width - 100}, ${height - 100})`);

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", "steelblue");

        legend.append("text")
            .attr("x", 15)
            .attr("y", 9)
            .text(line1Label);

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", "red");

        legend.append("text")
            .attr("x", 15)
            .attr("y", 29)
            .text(line2Label);
    }

    function handleMouseover(circle, value, svg, x, y) {
        d3.select(circle)
            .attr("r", 6)
            .style("cursor", "pointer");

        var xPosition = parseFloat(d3.select(circle).attr("cx")) + 10;
        var yPosition = parseFloat(d3.select(circle).attr("cy")) - 10;

        svg.append("text")
            .attr("id", "tooltip")
            .attr("x", xPosition)
            .attr("y", yPosition)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text(value);
    }

    function handleMouseout(svg) {
        d3.selectAll(".dot")
            .attr("r", 3)
            .style("cursor", "default");

        svg.select("#tooltip").remove();
    }

    // Load the GeoJSON data from a file
    fetch('coordinates/routes.geojson')
        .then(response => response.json())
        .then(routeData => {
            // Create a GeoJSON layer with the route data
            var routeLayer = L.geoJSON(routeData, {
                style: function (feature) {
                return {
                    color: 'blue', // Color of the route line
                    weight: 1,     // Thickness of the route line
                    opacity: 0.5,
                    dashArray: '5, 7 ',
                };
                }
            }).addTo(map); // Assuming 'map' is your Leaflet map object

            // Fit the map to the bounds of the route layer
            map.fitBounds(routeLayer.getBounds());
        })
        .catch(error => {
            console.error('Error loading route data:', error);
        });


    // Tile type: openstreetmap Hot
    var openstreetmapHot = L.tileLayer(
        'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 6
    })

    // Tile type: openstreetmap Osm
    var openstreetmapOsm = L.tileLayer(
        'http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 6
    })

    //Base layers definition and addition
    var allOptions = {
        "Open streetmap": openstreetmap,
        "Open streetmap: Hot": openstreetmapHot,
        "Open streetmap: Osm": openstreetmapOsm
    };

    // Tile type: openstreetmap normal
    var openstreetmap = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 6
    }).addTo(map);

    fetch('coordinates/southern-eu.geojson')
        .then(response => response.json())
        .then(geojson => {
            L.geoJSON(geojson, {
                style: {
                    fillColor: 'none', 
                    fillOpacity: 0.5,
                    color: 'blue',
                    weight: 2
                }
            }).addTo(map);
        })
        .catch(error => console.error('Error loading GeoJSON data:', error));


    fetch('coordinates/spain.geojson')
        .then(response => response.json())
        .then(geojson => {
            const geoJsonLayer = L.geoJSON(geojson, {
                onEachFeature: (feature, layer) => {
                    layer.on('mouseover', (event) => {
                        layer.setStyle({ fillColor: 'red', fillOpacity: 0.5, color: 'red', weight: 2 });
                        Tooltip.style("opacity", 1);
                    });
                    layer.on('mousemove', (event, d) => {
                        const tooltipWidth = Tooltip.node().offsetWidth;
                        const tooltipHeight = Tooltip.node().offsetHeight;
                        const pageWidth = window.innerWidth;
                        const pageHeight = window.innerHeight;
                        const tooltipX = (pageWidth - tooltipWidth) / 2;
                        const tooltipY = (pageHeight - tooltipHeight) / 2;
                    
                        Tooltip.html("This is Spain!")
                            .style("left", tooltipX + "px")
                            .style("top", tooltipY + "px")
                            .style("cursor", "default")
                            .style("opacity", 0.9);
                    });
                    
                    layer.on('mouseout', () => {
                        layer.setStyle({ fillColor: 'none', fillOpacity: 0.5, color: 'blue', weight: 2 });
                        Tooltip.style("opacity", 0);
                    });
                }
            }).addTo(map);
    
            // Append a tooltip div to the body
            var Tooltip = d3.select("body")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px");
        })
        .catch(error => console.error('Error loading GeoJSON data:', error));
    

    // Initialize with openstreetmap
    openstreetmap.addTo(map); 
    
    // Get all year items
    var yearItems = document.querySelectorAll('.year-item');

    // Add click event listener to each year item
    yearItems.forEach(function (yearItem) {
        yearItem.addEventListener('click', function () {
            // Remove the "active" class from all year items
            yearItems.forEach(function (item) {
                item.classList.remove('active');
            });

            // Add the "active" class to the clicked year item
            yearItem.classList.add('active');

            // Get the selected year from the data-year attribute
            var selectedYear = yearItem.getAttribute('data-year');

            // Clear existing map data
            clearMapData();

            // Only load coordinates and show visualizations for the year 2016
            if (selectedYear === '2016') {
                // Show or hide month items based on the selected year
                monthItems.forEach(function (monthItem) {
                    var itemYear = monthItem.getAttribute('data-year');
                    if (itemYear === selectedYear) {
                        monthItem.style.display = 'inline-block';
                    } else {
                        monthItem.style.display = 'none';
                    }
                });

                // Fetch coordinates from departure_coordinates.json file
                fetch('coordinates/departure_coordinates.json')
                .then(response => response.json())
                .then(coordinates => {
                    // Iterate through coordinates and add orange scatter plots
                    for (const key in coordinates) {
                        if (coordinates.hasOwnProperty(key)) {
                            const regionCoordinates = coordinates[key];

                            for (let i = 0; i < regionCoordinates.length; i++) {
                                var orangeMarker = L.circleMarker([regionCoordinates[i].lat, regionCoordinates[i].lon], {
                                    color: 'orange',
                                    fillColor: 'orange',
                                    fillOpacity: 1,
                                    radius: 4
                                }).addTo(map);
                            }
                        }
                    }
                })
                .catch(error => console.error('Error fetching coordinates:', error));

                fetch('coordinates/arrival_coor.json')
                    .then(response => response.json())
                    .then(coordinates => {
                        for (const key in coordinates) {
                            if (coordinates.hasOwnProperty(key)) {
                                const regionCoordinates = coordinates[key];

                                for (let i = 0; i < regionCoordinates.length; i++) {
                                    var marker = L.circleMarker([regionCoordinates[i].lat, regionCoordinates[i].lon], {
                                        color: 'blue',
                                        fillColor: 'blue',
                                        fillOpacity: 0.7,
                                        radius: 4
                                    }).addTo(map);

                                    if (countryVisualizations[key]) {
                                        countryVisualizations[key](regionCoordinates[i]);
                                    }
                                }
                            }
                        }
                    })
                    .catch(error => console.error('Error fetching coordinates:', error));
            } else {
                // Clear the map when a different year is selected
                map.eachLayer(function (layer) {
                    if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
                        map.removeLayer(layer);
                    }
                });
            }
        });
    });

    function clearMapData() {
        // Remove all markers and circle markers from the map
        map.eachLayer(function (layer) {
            if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
                map.removeLayer(layer);
            }
        });
    
        // Remove all visualizations from the map
        d3.selectAll(".visualization-container").remove();
    }

    // Choose the default year to display when load or reload page
    var defaultYear = '2016';

    // Find the year item with the default year and add the "active" class
    var defaultYearItem = document.querySelector('.year-item[data-year="' + defaultYear + '"]');
    if (defaultYearItem) {
        defaultYearItem.classList.add('active');
    }

    // Show or hide month items based on the default year
    var monthItems = document.querySelectorAll('.month-item');
    monthItems.forEach(function (monthItem) {
        var itemYear = monthItem.getAttribute('data-year');
        if (itemYear === defaultYear) {
            monthItem.style.display = 'inline-block';
        } else {
            monthItem.style.display = 'none';
        }
    });

    // Add click event listener to each year item
    yearItems.forEach(function (yearItem) {
        yearItem.addEventListener('click', function () {
            // Remove the "active" class from all year items
            yearItems.forEach(function (item) {
                item.classList.remove('active');
            });

            // Add the "active" class to the clicked year item
            yearItem.classList.add('active');

            // Get the selected year from the data-year attribute
            var selectedYear = yearItem.getAttribute('data-year');

            // Show or hide month items based on the selected year
            monthItems.forEach(function (monthItem) {
                var itemYear = monthItem.getAttribute('data-year');
                if (itemYear === selectedYear) {
                    monthItem.style.display = 'inline-block';
                } else {
                    monthItem.style.display = 'none';
                }
            });
        });
    });


    // Add click event listener to each month item
    var monthItems = document.querySelectorAll('.month-item');
    monthItems.forEach(function (monthItem) {
        monthItem.addEventListener('click', function () {
            // Remove the "active" class from all month items
            monthItems.forEach(function (item) {
                item.classList.remove('active');
            });

            // Add the "active" class to the clicked month item
            monthItem.classList.add('active');

            // Get the selected year from the data-year attribute
            var selectedYear = monthItem.getAttribute('data-year');

            // Show or hide year items based on the selected month
            var yearItems = document.querySelectorAll('.year-item[data-year="' + selectedYear + '"]');
            yearItems.forEach(function (yearItem) {
                yearItem.classList.remove('active');
            });
        });
    });

    // Add an event listener to the month wrapper for hover scrolling
    const monthWrapper = document.querySelector('.month-wrapper.compact');

    if (monthWrapper) {
        monthWrapper.addEventListener('mouseover', handleMonthHover);
    }

    function handleMonthHover(event) {
        const scrollSpeed = 3; 
        const direction = event.clientX < window.innerWidth / 2 ? -1 : 1; // Check if mouse is on the left or right side

        monthWrapper.scrollLeft += direction * scrollSpeed;
    }
 
}

window.onload = init;