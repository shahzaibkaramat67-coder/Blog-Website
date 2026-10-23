// import { Chart } from "chart.js";


let chart;

let chartTrend = document.getElementById("chartTrend").getContext("2d");
const selectRange = document.getElementById("selectRange")
selectRange.addEventListener("change", (e) => {
    dataLoad(e.target.value);

})


async function dataLoad(days = 7) {
    const res = await fetch(`/api/admin-users/Chart-data?days=${days}`)
    console.log(res);

    if (!res.ok) {
        throw new Error("Api data not beign fetch");
    }
    const data = await res.json()
    chartCreate(data);
}
dataLoad()
function chartCreate(data) {
    if (chart) {
        chart.destroy();
        // chart = null;
    }

    chart = new Chart(chartTrend, {
        type: "line",
        data: {
            labels: data.labelsArr,
            datasets: [
                {
                    label: "Active Users",
                    data: data.activeUserArr,
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: "New Users",
                    data: data.userArr,
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: "Logged In Users",
                    data: data.TodayLoginUserArr,
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
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


