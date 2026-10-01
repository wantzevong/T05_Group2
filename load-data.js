const dataFiles = {
    spotPrices: "data/Ex5_ARE_Spot_Prices.csv",
    tvEnergy55Inch: "data/Ex5_TV_energy_55inchtv_byScreenType.csv",
    tvEnergyAllSizes: "data/Ex5_TV_energy_Allsizes_byScreenType.csv",
    tvEnergy: "data/Ex5_TV_energy.csv"
};

function loadData() {
    return Promise.all(
        Object.entries(dataFiles).map(([name, path]) =>
            d3.csv(path).then((data) => [name, data])
        )
    ).then((datasets) => {
        window.chartData = Object.fromEntries(datasets);
        return window.chartData;
    });
}

loadData().catch((error) => {
    console.error("Unable to load chart data:", error);
});
