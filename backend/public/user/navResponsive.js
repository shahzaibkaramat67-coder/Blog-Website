// const btn = document.getElementById('nav-button');
// const menu = document.querySelector('.nav-item');

// btn.addEventListener("click", ()=>{
//     menu.classList.toggle("hidden")
// })
// const menu = document.querySelectorAll('.nav-item');

 const btn = document.getElementById('nav-button');
    const menu = document.getElementById('nav-item');

    btn.addEventListener('click', () => {
       
      menu.classList.toggle('hidden');
    });
const catbtn = document.getElementById('cat-button');
const catmenu = document.getElementById('cat-item');

catbtn.addEventListener('click', () => {
   catmenu.classList.toggle("hidden")
});
