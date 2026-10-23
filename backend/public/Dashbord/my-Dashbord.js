const rangeSelect = document.getElementById("rangeSelect");
const ctx = document.getElementById("trendChart").getContext("2d");

let chart;

// Initial empty chart
chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      { label: "Views", data: [], borderColor: "red", fill: false },
      { label: "Likes", data: [], borderColor: "green", fill: false },
      { label: "Shares", data: [], borderColor: "blue", fill: false }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
    scales: {
      x: { ticks: { color: "#555" } },
      y: { beginAtZero: true, ticks: { color: "#555" } }
    }
  }
});

// Fetch initial data
async function loadChart(days = 7) {
  try {
    const res = await fetch(`/profile/Dashbord/my-Dashboard/data?days=${days}`);
    const apiData = await res.json();

    chart.data.labels = apiData.labels;
    chart.data.datasets[0].data = apiData.views;
    chart.data.datasets[1].data = apiData.likes;
    chart.data.datasets[2].data = apiData.shares;

    chart.update();
  } catch (err) {
    console.error("Failed to fetch chart data", err);
  }
}

// Load default
loadChart();

// Change range
rangeSelect.addEventListener("change", () => {
  const days = rangeSelect.value;
  loadChart(days);
});