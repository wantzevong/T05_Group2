const barDataPath = "data/Ex5_TV_energy_55inchtv_byScreenType.csv";
const energyColumn = "Mean(Labelled energy consumption (kWh/year))";

function renderBarChart(data) {
    const container = d3.select("#bar-chart");
    const width = 560;
    const height = 320;
    const margin = { top: 48, right: 24, bottom: 56, left: 64 };

    container.selectAll("*").remove();

    const svg = container
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr("aria-label", "Average annual energy consumption for 55-inch TVs by screen type");

    const x = d3
        .scaleBand()
        .domain(data.map((item) => item.screenType))
        .range([margin.left, width - margin.right])
        .padding(0.3);

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (item) => item.energy)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", 24)
        .attr("text-anchor", "middle")
        .text("55-inch TV Energy Consumption by Screen Type");

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    svg.append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (item) => x(item.screenType))
        .attr("y", (item) => y(item.energy))
        .attr("width", x.bandwidth())
        .attr("height", (item) => y(0) - y(item.energy))
        .attr("fill", "#2563eb");
}

d3.csv(barDataPath, (row) => ({
    screenType: row.Screen_Tech,
    energy: Number(row[energyColumn])
}))
    .then(renderBarChart)
    .catch((error) => {
        console.error("Unable to load bar chart data:", error);
    });
