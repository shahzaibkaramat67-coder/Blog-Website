// document.addEventListener("DOMContentLoaded", () => {
//     const Manu = document.querySelector(".Manu");
//     const Dropdown = document.querySelector(".Dropdown")

//     Manu.addEventListener('mouseenter', async () => {
//         if (Dropdown.innerHTML.trim() === "") {
//             const Api = await fetch(`http://localhost:3002/api/user/Categorie`)
//             const { data } = await Api.json()
//             Dropdown.innerHTML = data.map(d =>
//                 `
//               <div class=" p-3 text-center text-sm  cursor-pointer">
//                     <div>${d.name}</div>
//                     <div>${d.topics.map(topic =>
//                        `<a href="/Categorie/${topic.slug}">${topic.title}</a>`).join("")}
//                     </div>
                   
//                   </div>    
//             `).join("")
//         }


//     })
// })