let modalChart = null;
let currentPostId = null;
let currentDays = 7;

// Open Modal (FIXED)
window.openChartModal = function (postId) {
  currentPostId = postId;
  document.getElementById("chartModal").classList.remove("hidden");

  const box = document.getElementById("modalChartBox");
  setTimeout(() => {
    box.classList.remove("opacity-0", "-translate-y-5", "translate-x-8");
  }, 10);

  loadChart(postId, currentDays);
};

// Close Modal
window.closeChart = function () {
  const box = document.getElementById("modalChartBox");
  box.classList.add("opacity-0", "-translate-y-5", "translate-x-8");

  setTimeout(() => {
    document.getElementById("chartModal").classList.add("hidden");
  }, 200);
};

// Change Days
window.changeDays = function (days) {
  currentDays = days;
  loadChart(currentPostId, currentDays);
};

// Load Chart From Backend
async function loadChart(postId, days) {
  try {
    const res = await fetch(`/chart-data/${postId}?days=${days}`);
    const data = await res.json();

    if (!data || !data.labels) {
      console.error("Invalid chart data");
      return;
    }

    const labels = data.labels;
    const views = data.views;
    const likes = data.likes;
    const shares = data.shares;

    if (modalChart) modalChart.destroy();

    modalChart = new Chart("modalChartCanvas", {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Views",
            data: views,
            borderColor: "red",
            fill: false
          },
          {
            label: "Likes",
            data: likes,
            borderColor: "green",
            fill: false
          },
          {
            label: "Shares",
            data: shares,
            borderColor: "blue",
            fill: false
          }
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
  } catch (err) {
    console.error("Error loading chart", err);
  }
}









































// const canvas = document.getElementById("trendChart");
// const ctx = canvas.getContext("2d");

// async function loadDashboardChart(days = 7) {
//   const res = await fetch(`/profile/Dashbord/my-Dashboard/chart-data?days=${days}`);
//   const data = await res.json();

//   if (window.trendChart) window.trendChart.destroy();

//   window.trendChart = new Chart(ctx, {
//     type: "line",
//     data: {
//       labels: data.dashboardlabels,
//       datasets: [
//         { dashboardlabel: "Views", data: data.dashboardviews, borderColor: "#16a34a", tension: 0.3 },
//         { dashboardlabel: "Likes", data: data.dashboardlikes, borderColor: "#dc2626", tension: 0.3 },
//         { dashboardlabel: "Shares", data: data.dashboardshares, borderColor: "#facc15", tension: 0.3 },
//       ],
//     },
//     options: { responsive: true, scales: { y: { beginAtZero: true } } }
//   });
// }

// // Default load
// loadDashboardChart();
