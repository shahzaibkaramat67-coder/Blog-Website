
    let modalChart = null;
    let currentPostId = null;
    let currentDays = 7;

    const articleContainer = document.getElementById("articleContainer")
    articleContainer.addEventListener("click", (e)=>{
        const btn =  e.target.closest(".chart-btn")
        if (!btn) {
          return null
        }
        const id = btn.dataset.id
              openChartModal(id)
    })
    
//     const openChartAnalytics = document.querySelectorAll(".chart-btn")
//     openChartAnalytics.forEach(btn => {
//       btn.addEventListener("click", ()=>{
//         const id =  btn.getAttribute("data-id")
//     })
    
// });

// Open Modal

function openChartModal(postId) {
  currentPostId = postId;
  document.getElementById("chartModal").classList.remove("hidden");
  
  const box = document.getElementById("modalChartBox");
  setTimeout(() => {
    box.classList.remove("opacity-0", "-translate-y-5", "translate-x-8");
  }, 10);

  loadChart(postId, currentDays);
  
    }
    window.openChartModal = openChartModal;
    
    
    
    
    const CloseChart = document.getElementById("CloseChart");
    function closeChart() {
      const box = document.getElementById("modalChartBox");
      box.classList.add("opacity-0", "-translate-y-5", "translate-x-8");

      setTimeout(() => {
        document.getElementById("chartModal").classList.add("hidden");
      }, 200);
      
    }
    CloseChart.addEventListener("click", closeChart)
    window.closeChart = closeChart;
    
    
    
    // Load Chart
    async function loadChart(postId, days) {
      const res = await fetch(`/profile/Dashbord/postsAnalytics/${postId}?days=${days}`);
      const data = await res.json();

      if (!data || !data.labels) return;
      
      const labels = data.labels;
      const views = data.views;
      const likes = data.likes;
      const shares = data.shares;
      
      
      const ctx = document.getElementById("modalChartCanvas");

        if (modalChart) modalChart.destroy();

        modalChart = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            { label: "Views", data: views, borderColor: "red", fill: false },
            { label: "Likes", data: likes, borderColor: "green", fill: false },
            { label: "Shares", data: shares, borderColor: "blue", fill: false }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: true } },
          scales: { x: { ticks: { color: "#555" } }, y: { beginAtZero: true, ticks: { color: "#555" } } }
        }
      });
    }
    
     
    
    const changeDay = document.getElementById("changeDay");
    if (changeDay) {
      changeDay.addEventListener("change", (e)=>{
        currentDays = e.target.value
        
        loadChart(currentPostId, currentDays);
      })
      
    }
    
    
    
    const rows = document.querySelectorAll(".rows")
    
    rows.forEach(row => {
      const id = row.getAttribute("data-id")
      let startTime;
      
      row.addEventListener("mousedown", async function (e) {
        if (e.button === 2) {
          showPopup(id)
        }
      })
      
      
      row.addEventListener("touchstart", ()=>{
        startTime = setTimeout(()=>{
          showPopup(id)
        }, 600)
      })


      row.addEventListener("touchend", ()=>{
        clearTimeout(startTime)
      })
      
      row.addEventListener("touchmove", ()=>{
        clearTimeout(startTime)
      })

      
      row.addEventListener("contextmenu",  e => e.preventDefault())
    });
    
    
    // //  correct
rows.forEach(row => {
  row.addEventListener("contextmenu", e => e.preventDefault());
});




function showPopup(id) {
  
  // Create popup background
  const popup = document.createElement("div");
  popup.id = "popup"
  popup.className = "fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center";
  
  const card = document.createElement("div");
  card.className = "bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-3 w-60";

 const deletebtn = document.createElement("button");
 deletebtn.className = "py-2 bg-red-600 text-white rounded-lg hover:bg-red-700";
 deletebtn.textContent = "Delete";
 deletebtn.addEventListener("click",() => deletePost(id))
 
 const updatebtn = document.createElement("button");
 updatebtn.className = "py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700";
 updatebtn.textContent = "Update";
 updatebtn.addEventListener("click",() => updatePost(id))
 
const Closebtn = document.createElement("button");
Closebtn.className = "py-2 bg-gray-200 rounded-lg";
Closebtn.textContent = "Close";
Closebtn.addEventListener("click",() => closePopup(id))

card.append(deletebtn, updatebtn, Closebtn)

popup.appendChild(card);

document.body.appendChild(popup)

}


async function deletePost(id) {

  try {
    const res =await fetch(`/profile/Dashbord/postsAnalytics/delete/${id}`, {
              method: "delete"
            })
            window.location.reload();
            console.log("click delete");
          } catch (error) {
            console.error(error)
            
          }
          
        }
        
        
        
async function updatePost(id) {
  
  try {
    window.location.href = `/profile/Dashbord/postsAnalytics/update/${id}`;
    
    console.log("click update");
    
  } catch (error) {
    console.error(error)
  }
  
  
}



function closePopup() {
  document.getElementById("popup")?.remove()
}











let page = 1;
const loadMoreBtn = document.getElementById("loadMoreBtn")

loadMoreBtn.addEventListener("click", async()=>{

  page++
  const res = await fetch(`/profile/Dashbord/postsAnalytics/page/${page}`,{
  })
  const posts = await res.json()
  // console.log("data", data);
  if (posts.legend === 0) {
    loadMoreBtn.innerText = "NO more article"
    loadMoreBtn.disable = true;
  }

  posts.forEach(post =>{
      const row = `
      <tr class="border-t hover:bg-gray-50 transition cursor-pointer">

        <td class="p-3 sm:p-4">
          <img src="${post.featured_image}" 
          class="w-16 sm:w-20 h-12 sm:h-14 object-cover rounded">
        </td>

        <td class="p-3 sm:p-4 font-semibold">
          ${post.title}
        </td>

        <td class="p-3 sm:p-4">
          ${new Date(post.publish_date).toLocaleDateString()}
        </td>

       <td class="p-3 sm:p-4 text-center">
                    <button data-id="${post._id}"
                      class="chart-btn bg-blue-100 hover:bg-blue-200 p-2 rounded-full text-xl transition-all">📊</button>
                  </td>

        <td class="p-3 sm:p-4">${post.totalViews}</td>
        <td class="p-3 sm:p-4">${post.totalLikes}</td>
        <td class="p-3 sm:p-4">${post.totalShares}</td>
        <td class="p-3 sm:p-4">$${post.estimatedEarningMills}</td>

      </tr>
    `

    articleContainer.insertAdjacentHTML("beforeend", row)

  })


  
  
})









    





  





//     // Change Days
//     // function changeCharByDay(days) {
//     //    currentDays = days;
//     //   loadChart(currentPostId, currentDays);
//     // }

//     // window.changeDays = function (days) {
     
//     // };

//   
//    



    














//     document.addEventListener("DOMContentLoaded", () => {
//   const loadMoreBtn = document.getElementById("loadMoreBtn");
//   const articleContainer = document.getElementById("articleContainer");
//   let page = 2;

//   async function loadArticle() {
//     console.log("frontend: loadArticle called, page=", page);
//     const res = await fetch(`/profile/Dashbord/postsAnalytics/page/${page}`);
//     console.log("frontend: fetch sent");
//     const articalLoad = await res.json();
//     console.log("backend response:", articalLoad);

//     if (!articalLoad || articalLoad.length === 0) {
//       loadMoreBtn.style.display = "none";
//       return;
//     }

//     articalLoad.forEach(post => {
//       const tr = document.createElement("tr");
//       tr.dataset.id = post._id;
//       tr.className = "rows border-t hover:bg-gray-50 transition cursor-pointer";
//       tr.innerHTML = `
//         <td class="p-3 sm:p-4">
//           <img src="${post.featured_image}" class="w-16 sm:w-20 h-12 sm:h-14 object-cover rounded">
//         </td>
//         <td class="p-3 sm:p-4 font-semibold truncate max-w-[150px] sm:max-w-none">${post.title}</td>
//         <td class="p-3 sm:p-4">${new Date(post.publish_date).toLocaleDateString()}</td>
//         <td class="p-3 sm:p-4 text-center">
//           <button onclick="openChartModal('${post._id}')" class="bg-blue-100 hover:bg-blue-200 p-2 rounded-full text-xl transition-all">📊</button>
//         </td>
//         <td class="p-3 sm:p-4">${post.totalViews}</td>
//         <td class="p-3 sm:p-4">${post.totalLikes}</td>
//         <td class="p-3 sm:p-4">${post.totalShares}</td>
//         <td class="p-3 sm:p-4">$${post.estimatedEarningMills}</td>
//       `;
//       articleContainer.appendChild(tr);
//     });

//     page++;
//   }

//   loadMoreBtn.addEventListener("click", loadArticle);
// });






 