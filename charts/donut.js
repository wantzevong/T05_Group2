// Source CSV and energy column used for the donut values.
const donutDataPath = "data/Ex5_TV_energy_Allsizes_byScreenType.csv";
const donutEnergyColumn = "Mean(Labelled energy consumption (kWh/year))";

function renderDonutChart(data) {
    // Set up the responsive SVG and donut dimensions.
    const container = d3.select("#donut-chart");
    const width = 560;
    const height = 320;
    const center = { x: 180, y: 180 };
    const radius = 88;

    container.selectAll("*").remove();

    const svg = container
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr("aria-label", "Mean annual energy consumption by screen type");

    // Assign a distinct color to each screen technology.
    const color = d3.scaleOrdinal()
        .domain(data.map((item) => item.screenType))
        .range(["#2563eb", "#14b8a6", "#f59e0b"]);

    // Convert the energy values into donut slices with a central hole.
    const pie = d3
        .pie()
        .sort(null)
        .value((item) => item.energy);

    const arc = d3
        .arc()
        .innerRadius(radius * 0.55)
        .outerRadius(radius);

    // Add the chart title and position the donut in the SVG.
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", 24)
        .attr("text-anchor", "middle")
        .text("Energy Consumption by Screen Type");

    const chart = svg.append("g")
        .attr("transform", `translate(${center.x},${center.y})`);

    // Draw each slice and provide its value on hover.
    chart.selectAll("path")
        .data(pie(data))
        .join("path")
        .attr("d", arc)
        .attr("fill", (slice) => color(slice.data.screenType))
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2)
        .append("title")
        .text((slice) => `${slice.data.screenType}: ${slice.data.energy.toFixed(1)} kWh/year`);

    // Add a legend with the screen type and energy value for each slice.
    const legend = svg.append("g")
        .attr("transform", "translate(330,110)");

    legend.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", 0)
        .attr("y", (item, index) => index * 34)
        .attr("width", 14)
        .attr("height", 14)
        .attr("fill", (item) => color(item.screenType));

    legend.selectAll("text")
        .data(data)
        .join("text")
        .attr("x", 24)
        .attr("y", (item, index) => index * 34 + 12)
        .text((item) => `${item.screenType}: ${item.energy.toFixed(1)} kWh/year`);
}

    // Load, convert, and validate the donut chart data before rendering.
d3.csv(donutDataPath, (row) => ({
    screenType: row.Screen_Tech,
    energy: Number(row[donutEnergyColumn])
}))
    .then((data) => data.filter((item) => Number.isFinite(item.energy) && item.energy > 0))
    .then(renderDonutChart)
    .catch((error) => {
        // Report data-loading errors without stopping other charts.
        console.error("Unable to load donut chart data:", error);
    });
