

let chart;   // store chart instance

const chartCtx = document.getElementById("chartTrend").getContext("2d");

function renderChart(data) {

    // destroy old chart
    if (chart) chart.destroy();

    chart = new Chart(chartCtx, {
        type: "line",
        data: {
            labels: data.data.map(d => d.day),
            datasets: [
                {
                    label: "Earning",
                    data: data.data.map(d => d.totalEarning),
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "top" }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

async function loadChart(days = 7) {
    const res = await fetch(`/api/admin-earning/chart-data?days=${days}`);
    const data = await res.json();
    renderChart(data);
}

loadChart();

document.getElementById("selectRange").addEventListener("change", function () {
    loadChart(this.value);
});

