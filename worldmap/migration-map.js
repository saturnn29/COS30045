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

    L.Popup.prototype.options.className = 'custom-popup';

    const countryCodes = ['spain', 'italy', 'greece', 'bulgaria', 'hungary', 'albania', 'malta', 'kosovo', 'montenegro'];

    const yearRange = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];

    // Create a container for the legend on the map
    var legendContainer = L.control({position: 'bottomright'});

    legendContainer.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend-container');
        return div;
    };

    legendContainer.addTo(map);

    d3.select(".legend-container")
        .append("svg")
        .attr("width", 250)
        .attr("height", 110)
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 250)
        .attr("height", 110)
        .attr("rx", 15)  
        .attr("ry", 15)
        .style("fill", "white");
    
    d3.select(".legend-container svg")
        .append("text")
        .attr("x", 23) 
        .attr("y", 15) 
        .text("Migration Trends:")
        .style("font-size", "15px");

    d3.select(".legend-container svg")
        .append("circle")
        .attr("cx", 30) 
        .attr("cy", 30) 
        .attr("r", 5) 
        .style("fill", "blue");

    d3.select(".legend-container svg")
        .append("text")
        .attr("x", 50) 
        .attr("y", 35) 
        .text("Arrival Point")
        .style("font-size", "12px");

    d3.select(".legend-container svg")
        .append("circle")
        .attr("cx", 30) 
        .attr("cy", 45) 
        .attr("r", 5) 
        .style("fill", "red");

    d3.select(".legend-container svg")
        .append("text")
        .attr("x", 50)
        .attr("y", 50) 
        .text("Departure Point")
        .style("font-size", "12px");

    d3.select(".legend-container svg")
        .append("circle")
        .attr("cx", 30) 
        .attr("cy", 60) 
        .attr("r", 5) 
        .style("fill", "grey");

    d3.select(".legend-container svg")
        .append("text")
        .attr("x", 50)
        .attr("y", 65) 
        .text("Not Changed")
        .style("font-size", "12px");

    d3.select(".legend-container svg")
        .append("circle")
        .attr("cx", 30) 
        .attr("cy", 75) 
        .attr("r", 5) 
        .style("fill", "orange");

    d3.select(".legend-container svg")
        .append("text")
        .attr("x", 50)
        .attr("y", 80) 
        .text("Decrease")
        .style("font-size", "12px");

    d3.select(".legend-container svg")
        .append("circle")
        .attr("cx", 30) 
        .attr("cy", 90) 
        .attr("r", 5) 
        .style("fill", "green");

    d3.select(".legend-container svg")
        .append("text")
        .attr("x", 50)
        .attr("y", 95   ) 
        .text("Increase")
        .style("font-size", "12px");


    // Visualize for each year in the range
    for (let year = yearRange[0]; year <= yearRange[-1]; year++) {
        visualizeYear(year);
    }

    function visualizeYear(year) {
        console.log("Visualizing year:", year); 
        countryCodes.forEach(countryCode => {
            visualizeCountry(countryCode, year);
        });
    } 

    const prevYearTotals = {};

    function visualizeCountry(countryCode, year) {
        console.log("Visualizing country:", countryCode, "for year:", year);
        const csvFile = `to_${countryCode}${year}.csv`;
        const popupId = `popup-chart-${countryCode}`;
        let markerColor;
        let countryName;
    
        switch (countryCode) {
            case 'spain':
                countryName = 'Spain';
                break;
            case 'italy':
                countryName = 'Italy';
                break;
            case 'greece':
                countryName = 'Greece';
                break;
            case 'bulgaria':
                countryName = 'Bulgaria';
                break;
            case 'hungary':
                countryName = 'Hungary';
                break;
            case 'albania':
                countryName = 'Albania';
                break;
            case 'malta':
                countryName = 'Malta';
                break;
            case 'kosovo':
                countryName = 'Kosovo';
                break;
            case 'montenegro':
                countryName = 'Montenegro';
                break;
            default:
                countryName = 'Unknown';
        }
    
        const dataUrl = `to_eu16-23/${year}/${csvFile}`;
    
        d3.csv(dataUrl).then(function(data) {
            const currentYearTotal = data.reduce((total, row) => total + parseInt(row['by land']) + parseInt(row['by sea']), 0);

            // Initialize prevYearTotal for the current country if it doesn't exist
            if (!prevYearTotals[countryCode]) {
                prevYearTotals[countryCode] = 0;
            }

            const prevYearTotal = prevYearTotals[countryCode];

            if (year == '2016') {
                markerColor = 'gray';
            } else {
                markerColor = currentYearTotal > prevYearTotal ? 'green' : 'orange';
            }

            prevYearTotals[countryCode] = currentYearTotal;

            console.log(prevYearTotal, currentYearTotal);
    
            // Fetch the coordinates for the current country from chart_coor.json
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
                            radius: 14
                        }).addTo(map);
    
                        marker.on('click', function() {
                            const ratio = calculateRatio(currentYearTotal, prevYearTotal, year);
                            var popupContent = `<div><h3>${countryName}</h3><div id="${popupId}" style="width: 300px; height: 300px;"></div><p>${ratio}</p></div>`;
                            var popup = marker.bindPopup(popupContent).openPopup();
    
                            console.log("Fetching data from URL:", dataUrl);
    
                            createVisualization(`#${popupId}`, data, "By land", "By sea");
                        });
                    });
                })
                .catch(error => {
                    console.error('Error fetching coordinates:', error);
                });
        }).catch(error => {
            console.error('Error fetching CSV data:', error);
        });
    } 

    function calculateRatio(currentYearTotal, prevYearTotal, year) {
        if (year == '2016') {
            return `<p>Total arrivals for the year 2016: ${currentYearTotal}</p>`;
        } else if (prevYearTotal === 0) {
            return '<p>No arrivals for the previous year.</p>';
        } else {
            const ratio = currentYearTotal / prevYearTotal;
            console.log(currentYearTotal, prevYearTotal);
            const percentageChange = ratio > 1 ? (ratio - 1) * 100 : (1 - ratio) * 100;
            const formattedPercentage = percentageChange.toFixed(2).replace('.', ','); // Format with two decimal places and replace dot with comma
            return ratio > 1
            ? `<p>The total arrivals for this year are ${formattedPercentage}% higher than the previous year.</p>`
            : `<p>The total arrivals for this year are ${formattedPercentage}% lower than the previous year.</p>`;
        }
    }

    function createVisualization(containerSelector, data, line1Label, line2Label ) {
        let w = 270;
        let h = 270;

        let margin = { top: 50, right: 50, bottom: 50, left: 80 };
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
            .attr("transform", `translate(${width - 120}, ${height - 120})`);

        legend.append("rect")
            .attr("x", 118)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", "steelblue");

        legend.append("text")
            .attr("x", 130)
            .attr("y", 9)
            .text(line1Label);

        legend.append("rect")
            .attr("x", 118)
            .attr("y", 20)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", "red");

        legend.append("text")
            .attr("x", 130)
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
                    opacity: 0.7,
                    dashArray: '6, 7',
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
                            color: 'red',
                            fillColor: 'red',
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

    function loadGeoJSONFiles(filePaths) {
        // Create a Promise for each file
        const promises = filePaths.map(filePath => {
            return fetch(filePath)
                .then(response => response.json())
                .catch(error => {
                    console.error('Error loading GeoJSON data:', error);
                    throw error;
                });
        });
        // Wait for all promises to resolve
        return Promise.all(promises)
            .then(geojsonArray => {
                geojsonArray.forEach((geojson, index) => {
                    // Process each GeoJSON data
                    processGeoJSON(geojson, index);
                });
            });
    }

    function processGeoJSON(geojson, index) {
        const Tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");
    
        const defaultStyle = {
            fillColor: 'rgb(17, 89, 197)',
            fillOpacity: 0.5,
            color: 'rgb(17, 89, 197)',
            weight: 2
        };
    
        const highlightStyle = {
            fillColor: 'rgb(241, 236, 85)',
            fillOpacity: 0.8,
            color: 'rgb(241, 236, 85))',
            weight: 3
        };
    
        const geoJsonLayer = L.geoJSON(geojson, {   
            style: defaultStyle,
            onEachFeature: (feature, layer) => {
                layer.on('mouseover', () => {
                    layer.setStyle(highlightStyle);
                    const countryName = feature.properties.name || 'Unknown';
                    const countryFlag = feature.properties.flag || '';
                    layer.bindTooltip(`<div class="country-tooltip"><strong>${countryName} ${countryFlag}</strong></div>`, { permanent: false, sticky: true, offset: [10, 0] }).openTooltip();
                });
    
                layer.on('mouseout', () => {
                    layer.setStyle(defaultStyle);
                    layer.unbindTooltip();
                });
            }
        }).addTo(map);
    }    

    const filePaths = ['coordinates/spain.geojson', 'coordinates/italy.geojson', 'coordinates/albania.geojson', 'coordinates/greece.geojson', 'coordinates/montenegro.geojson', 'coordinates/kosovo.geojson', 'coordinates/hungary.geojson', 'coordinates/bulgaria.geojson', 'coordinates/malta.geojson'];
    loadGeoJSONFiles(filePaths)
        .then(() => console.log('All GeoJSON files loaded and processed'))
        .catch(error => console.error('Error loading GeoJSON files:', error));
    
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

    // Load coordinates and visualizations for the default year
    loadCoordinatesAndVisualizations(defaultYear);

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
        loadCoordinatesAndVisualizations(2016);

        // Hide all month items for other years
        monthItems.forEach(function (monthItem) {
            var itemYear = monthItem.getAttribute('data-year');
            if (itemYear === '2016') {
                monthItem.style.display = 'inline-block';
            } else {
                monthItem.style.display = 'none';
            }
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
        monthWrapper.addEventListener('mousemove', handleMonthHover);
    }

    function handleMonthHover(event) {
        const scrollSpeed = 3; 
        const direction = event.clientX < window.innerWidth / 2 ? -1 : 1; // Check if mouse is on the left or right side

        monthWrapper.scrollLeft += direction * scrollSpeed;
    }
 
}

window.onload = init;