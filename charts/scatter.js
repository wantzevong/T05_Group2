const scatterDataPath = "data/Ex5_TV_energy.csv";

function renderScatterPlot(data) {
    const container = d3.select("#scatter-chart");
    const width = 560;
    const height = 320;
    const margin = { top: 48, right: 24, bottom: 56, left: 64 };

    container.selectAll("*").remove();

    const svg = container
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr("aria-label", "TV screen size compared with energy consumption");

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, (item) => item.screenSize))
        .nice()
        .range([margin.left, width - margin.right]);

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (item) => item.energyConsumption)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", 24)
        .attr("text-anchor", "middle")
        .text("TV Screen Size vs Energy Consumption");

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", (item) => x(item.screenSize))
        .attr("cy", (item) => y(item.energyConsumption))
        .attr("r", 3)
        .attr("fill", (item) => color(item.screenTech))
        .attr("opacity", 0.7)
        .append("title")
        .text((item) => `${item.brand}: ${item.screenSize}-inch, ${item.energyConsumption} kWh`);
}

d3.csv(scatterDataPath, (row) => ({
    brand: row.brand,
    screenTech: row.screen_tech,
    screenSize: Number(row.screensize),
    energyConsumption: Number(row.energy_consumpt)
}))
    .then((data) => data.filter((item) => Number.isFinite(item.screenSize) && Number.isFinite(item.energyConsumption)))
    .then(renderScatterPlot)
    .catch((error) => {
        console.error("Unable to load scatter plot data:", error);
    });
