function init() {
    var map = L
    .map('mapid')
    .setView([48.8566, 2.3522], 5);

    // Tile type: openstreetmap normal
    var openstreetmap = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 18
    })

    const countryCodes = ['spain', 'italy', 'greece', 'bulgaria', 'hungary', 'albania', 'malta', 'kosovo', 'montenegro'];

    const yearRange = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

    // Visualize for each year in the range
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
        visualizeYear(year);
    }

    function visualizeYear(year) {
        console.log("Visualizing year:", year); 
        countryCodes.forEach(countryCode => {
            visualizeCountry(countryCode, year);
        });
    } 

    function visualizeCountry(countryCode, year) {
        console.log("Visualizing country:", countryCode, "for year:", year);
        const csvFile = `to_${countryCode}${year}.csv`;
        const popupId = `popup-chart-${countryCode}`;
        let markerColor;

        switch (countryCode) {
            case 'spain':
                markerColor = getColorForYear(year, 'gray', 'green', 'green', 'orange');
                break;
            case 'italy':
                markerColor = getColorForYear(year, 'gray', 'purple', 'pink', 'brown');
                break;
            case 'greece':
                markerColor = getColorForYear(year, 'gray', 'darkblue', 'navy', 'aqua');
                break;
            case 'bulgaria':
                markerColor = getColorForYear(year, 'gray', 'lime', 'olive', 'teal');
                break;
            case 'hungary':
                markerColor = getColorForYear(year, 'gray', 'coral', 'tomato', 'salmon');
                break;
            case 'albania':
                markerColor = getColorForYear(year, 'gray', 'crimson', 'maroon', 'firebrick');
                break;
            case 'malta':
                markerColor = getColorForYear(year, 'gray', 'indigo', 'violet', 'plum');
                break;
            case 'kosovo':
                markerColor = getColorForYear(year, 'gray', 'gold', 'goldenrod', 'khaki');
                break;
            case 'montenegro':
                markerColor = getColorForYear(year, 'gray', 'lime', 'olive', 'teal');
                break;
            default:
                markerColor = 'black'; // Default color if no country code is matched
        }
    
        // Fetch the coordinates for the current country from arrival_coor.json
        fetch('coordinates/chart_coor.json')
            .then(response => response.json())
            .then(coordinates => {
                const countryCoordinates = coordinates[countryCode] || [];
    
                // Create a marker for each coordinate
                countryCoordinates.forEach(coordinate => {
                    const marker = L.circleMarker([coordinate.lat, coordinate.lon], {
                        color: markerColor,
                        fillColor: markerColor,
                        fillOpacity: 0.5,
                        radius: 20
                    }).addTo(map);
    
                    const dataUrl = `to_eu16-23/${year}/${csvFile}`;
    
                    marker.on('click', function() {
                        var popupContent = `<div id="${popupId}" style="width: 200px; height: 200px;"></div>`;
                        var popup = marker.bindPopup(popupContent).openPopup();
    
                        console.log("Fetching data from URL:", dataUrl);
    
                        d3.csv(dataUrl).then(function(data) {
                            createVisualization(`#${popupId}`, data, "By land", "By sea");
                        });
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching coordinates:', error);
            });
    }  

    function getColorForYear(year, color2016, color2017, color2018, color2019, color2020, color2021, color2022, color2023) {
        switch (year) {
            case 2016:
                return color2016;
            case 2017:
                return color2017;
            case 2018:
                return color2018;
            case 2019:
                return color2019;
            case 2020:
                return color2020;
            case 2021:
                return color2021;
            case 2022:
                return color2022;
            case 2023:
                return color2023;
            default:
                return 'black'; 
        }
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
            .range([height, 0])
            .nice();

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
                    dashArray: '5, 7',
                };
                }
            }).addTo(map); // Assuming 'map' is your Leaflet map object

            // Fit the map to the bounds of the route layer
            map.fitBounds(routeLayer.getBounds());
        })
        .catch(error => {
            console.error('Error loading route data:', error);
        });

    fetch('coordinates/arr_spain.json')
        .then(response => response.json())
        .then(coordinates => {
            // Iterate through coordinates and add orange scatter plots
            for (const key in coordinates) {
                if (coordinates.hasOwnProperty(key)) {
                    const regionCoordinates = coordinates[key];

                    for (let i = 0; i < regionCoordinates.length; i++) {
                        var orangeMarker = L.circleMarker([regionCoordinates[i].lat, regionCoordinates[i].lon], {
                            color: 'blue',
                            fillColor: 'blue',
                            fillOpacity: 1,
                            radius: 4
                        }).addTo(map);
                    }
                }
            }
        })
        .catch(error => console.error('Error fetching coordinates:', error));

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
                            radius: 3
                        }).addTo(map);
                    }
                }
            }
        })
        .catch(error => console.error('Error fetching coordinates:', error));
    

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

    // Initialize with openstreetmap
    openstreetmap.addTo(map); 

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
                        Tooltip
                        .html("This is Spain")
                        .style("left", (d3.mouse(this)[0]+70) + "px")
                        .style("top", (d3.mouse(this)[1]) + "px")
                        .style("cursor", "default")
                        .style("opacity", 0.9);
                    });
                    
                    layer.on('mouseout', () => {
                        layer.setStyle({ fillColor: 'none', fillOpacity: 0.5, color: 'none', weight: 2 });
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

            // Show or hide month items based on the selected year
            monthItems.forEach(function (monthItem) {
                var itemYear = monthItem.getAttribute('data-year');
                if (itemYear === selectedYear) {
                    monthItem.style.display = 'inline-block';
                } else {
                    monthItem.style.display = 'none';
                }
            });

            // Define the range of years you want to handle
            const yearRange = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

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

            fetch('coordinates/arr_spain.json')
                .then(response => response.json())
                .then(coordinates => {
                    // Iterate through coordinates and add orange scatter plots
                    for (const key in coordinates) {
                        if (coordinates.hasOwnProperty(key)) {
                            const regionCoordinates = coordinates[key];

                            for (let i = 0; i < regionCoordinates.length; i++) {
                                var orangeMarker = L.circleMarker([regionCoordinates[i].lat, regionCoordinates[i].lon], {
                                    color: 'blue',
                                    fillColor: 'blue',
                                    fillOpacity: 1,
                                    radius: 4
                                }).addTo(map);
                            }
                        }
                    }
                })
                .catch(error => console.error('Error fetching coordinates:', error));

            // Perform actions based on the selected year
            if (yearRange.includes(parseInt(selectedYear))) {
                // Load coordinates and visualizations for the selected year
                loadCoordinatesAndVisualizations(selectedYear);
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

    function loadCoordinatesAndVisualizations(selectedYear) {
        // Call the visualizeYear function for the selected year
        visualizeYear(selectedYear);
    }


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

    // Add click event listener to the year item for 2016
    var year2016Item = document.querySelector('.year-item[data-year="2016"]');
    year2016Item.addEventListener('click', function () {
        // Remove the "active" class from all year items
        yearItems.forEach(function (item) {
            item.classList.remove('active');
        });

        // Add the "active" class to the clicked year item
        year2016Item.classList.add('active');

        // Clear existing map data
        clearMapData();

        // Load data for the year 2016
        visualizeYear(2016);

        // Hide all month items for other years
        monthItems.forEach(function (monthItem) {
            monthItem.style.display = 'none';
        });
    });


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
