
            let chart;
            const chartCtx = document.getElementById("chartTrend").getContext("2d");

            function renderChart(data) {
                if (chart) chart.destroy();

                chart = new Chart(chartCtx, {
                    type: "line",
                    data: {
                        labels: data.labels,
                        datasets: [
                            {
                                label: "Views",
                                data: data.views,
                                borderWidth: 2,
                                tension: 0.4
                            },
                            {
                                label: "Likes",
                                data: data.likes,
                                borderWidth: 2,
                                tension: 0.4
                            },
                            {
                                label: "Shares",
                                data: data.shares,
                                borderWidth: 2,
                                tension: 0.4
                            },
                            {
                                label: "Blogs",
                                data: data.blogs,
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

            // initial load
            async function loadChart(days = 7) {
                const res = await fetch(`/api/admin-dashboard/chart-data?days=${days}`);
                console.log(res);


                if (!res.ok) {
                    console.error("Failed to fetch chart data");
                    return;
                }

                const data = await res.json();
                renderChart(data);
            }


            loadChart();

            // dropdown change
            document.getElementById("selectRange").addEventListener("change", function () {
                loadChart(this.value);
            });
    




























// function message(id) {
//     const massagePopup = document.querySelector("#massagePopup")
//     massagePopup.innerHTML = `
//           <div id="chartModal" class="hidden fixed inset-0 bg-black/60 flex justify-end items-start p-6 overflow-auto">
//     <div id="modalChartBox" class="bg-white p-6 rounded-xl w-full max-w-[1050px] h-[550px] shadow transform transition duration-300 opacity-0 -translate-y-5 translate-x-8 flex flex-col">
//       <button class="self-end text-red-500 text-2xl font-bold">✖</button>
//       <h2 class="text-2xl font-bold mb-4 text-gray-800">Post Analytics</h2>
     
//       <!-- Chart Container -->
//       <div class="flex-1 overflow-x-auto">
//         <canvas id="modalChartCanvas" style="min-width:800px; width:100%; height:100%;"></canvas>
//       </div>
//     </div>
//   </div>
//         `

//         console.log(massagePopup);
        
// }
// message(id)
