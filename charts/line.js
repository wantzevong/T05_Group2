// Source CSV containing yearly regional and average spot prices.
const lineDataPath = "data/Ex5_ARE_Spot_Prices.csv";

function renderLineChart(data) {
    // Set up the responsive SVG and identify the data series.
    const container = d3.select("#line-chart");
    const width = 560;
    const height = 320;
    const margin = { top: 48, right: 24, bottom: 82, left: 64 };
    const columns = Object.keys(data[0]);
    const averageKey = columns.find((column) => column.startsWith("Average Price"));
    const stateKeys = columns.filter((column) => column !== "Year" && column !== averageKey);
    const series = [...stateKeys, averageKey].map((key) => ({
        key,
        label: key === averageKey ? "Average Price" : key.split(" (")[0],
        values: data.map((row) => ({ year: row.Year, price: row[key] }))
    }));

    container.selectAll("*").remove();

    // Create scales for years and spot prices.
    const svg = container
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr("aria-label", "Australian electricity spot prices by state and average price");

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, (row) => row.Year))
        .range([margin.left, width - margin.right]);

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (row) => d3.max(columns.slice(1), (column) => row[column]))])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
        .domain(stateKeys)
        .range(d3.schemeTableau10);

    const line = d3
        .line()
        .x((point) => x(point.year))
        .y((point) => y(point.price));

    // Add the chart title and axes.
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", 24)
        .attr("text-anchor", "middle")
        .text("Australian Electricity Spot Prices");

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // Draw regional lines and emphasize the average in bold black.
    svg.append("g")
        .selectAll("path")
        .data(series)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", (item) => item.key === averageKey ? "#000000" : color(item.key))
        .attr("stroke-width", (item) => item.key === averageKey ? 3 : 1.5)
        .attr("d", (item) => line(item.values));

    // Add a legend matching each line's color and weight.
    const legend = svg.append("g")
        .attr("transform", `translate(${margin.left},${height - 42})`);

    legend.selectAll("line")
        .data(series)
        .join("line")
        .attr("x1", (item, index) => (index % 4) * 122)
        .attr("x2", (item, index) => (index % 4) * 122 + 18)
        .attr("y1", (item, index) => Math.floor(index / 4) * 22)
        .attr("y2", (item, index) => Math.floor(index / 4) * 22)
        .attr("stroke", (item) => item.key === averageKey ? "#000000" : color(item.key))
        .attr("stroke-width", (item) => item.key === averageKey ? 3 : 1.5);

    legend.selectAll("text")
        .data(series)
        .join("text")
        .attr("x", (item, index) => (index % 4) * 122 + 24)
        .attr("y", (item, index) => Math.floor(index / 4) * 22 + 4)
        .attr("font-size", 10)
        .text((item) => item.label);
}

    // Convert all CSV values to numbers before rendering the chart.
d3.csv(lineDataPath, (row) => {
    const parsedRow = { Year: Number(row.Year) };

    Object.entries(row).forEach(([key, value]) => {
        if (key !== "Year") {
            parsedRow[key] = Number(value);
        }
    });

    return parsedRow;
})
    .then(renderLineChart)
    .catch((error) => {
        // Report data-loading errors without stopping other charts.
        console.error("Unable to load line chart data:", error);
    });
