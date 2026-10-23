const form = document.getElementById("uploadForm");
const btn = document.getElementById("uploadBtn");
const popup = document.getElementById("popup");

function showPopup(message, color = "bg-green-500") {
  popup.className =
    `fixed top-6 right-6 flex items-center gap-3 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium transition-all duration-300 ${color}`;

  popup.innerHTML = `
    <span>${color === "bg-green-500" ? "✅" : "❌"}</span>
    <span>${message}</span>
  `;

  popup.classList.remove("hidden");

  setTimeout(() => {
    popup.classList.add("hidden");
  }, 2000);
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    btn.disabled = true;
    btn.innerText = "Uploading...";

    const formData = new FormData(form);

    try {
      const response = await fetch(
        "/profile/Dashbord/craete-Artical/upload-blog",
        {
          method: "POST",
          body: formData,
        }
      );

      const res = await response.json();

      if (res.success) {
        // alert("this i siwbdiuwbiuwb")
        showPopup("Blog uploaded successfully 🎉");

        form.reset();

        setTimeout(() => {
          window.location.href = "/profile/Dashbord/craete-Artical";
        }, 2500);

      } else {
        showPopup(res.message || "Upload failed", "bg-red-500");

        btn.disabled = false;
        btn.innerText = "Upload Blog Post";
      }
    } catch (err) {
      console.log(err);

      showPopup("Server error", "bg-red-500");

      btn.disabled = false;
      btn.innerText = "Upload Blog Post";
    }
  });
}


// const form = document.getElementById('uploadForm');

// let disabled = false

// if (form) {
// const popup = document.getElementById("popup")
//   const btn = document.getElementById('uploadBtn');

//    function showPopup(message, color = "bg-green-500") {
//      popup.className =   `fixed top-6 right-6 flex items-center gap-3 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium transition-all duration-300 ${color}`;
//    popup.innerHTML = `
//       <span>${color === "bg-green-500" ? "✅" : "❌"}</span>
//       <span>${message}</span>
//     `;

//      popup.classList.remove("hidden");

//     setTimeout(() => {
//       popup.classList.add("hidden");
//     }, 2000);
//   }

//   }




//   form.addEventListener('submit', async (e) => {
//     e.preventDefault();


//     btn.disabled = true;
//     btn.innerText = "Uploading..."


//     const formData = new FormData(form);

//     try {

//       const response = await fetch('/profile/Dashbord/craete-Artical/upload-blog', {
//         method: "POST",
//         body: formData
//       });

//       const res = await response.json();

//       if (res.success) {

//       //  popup.classList.remove("hidden")
//         showPopup("Blog uploaded successfully 🎉", "bg-green-500");


//         form.reset();
//         window.location.href = '/profile/Dashbord/craete-Artical';
//       } else {
//          showPopup(res.message || "Upload failed", "bg-red-500");

//         btn.disabled = false;
//         btn.innerText = "Upload Blog Post";
//       }

//     } catch (err) {
//       console.log(err);
//       alert('Server error');
//     }

//   });



// const form = document.getElementById('uploadForm');

// if (form) {
//   const bar = document.getElementById('progressBar');
//   const text = document.getElementById('progressText');
//   const progressBox = document.getElementById('progressBox');
//   const btn = document.getElementById('uploadBtn');

//   let uploading = false;

//   form.addEventListener('submit', async (e) => {
//     // if (uploading) return;

//     // uploading = true;
//     // btn.disabled = true;
//     // btn.innerText = 'Uploading...';
//     // progressBox.classList.remove('hidden');

//     const formData = new FormData(form);

//     try {
//       // const res = await axios.post('/profile/Dashbord/craete-Artical/upload-blog', formData, {
//       //   onUploadProgress: (p) => {
//       //     if (!p.total) return;
//       //     const percent = Math.round((p.loaded * 100) / p.total);
//       //     bar.style.width = percent + '%';
//       //     text.innerText = percent + '%';
//       //   }
//       // });


//       const data = await fetch('/profile/Dashbord/craete-Artical/upload-blog', {
//         method: "post",
//         headers: {
//           "Content-Type": "application/json"
//         },
//          body: formData
//       })
//       const res =await data.json()


//       if (res.data.success) {
//         alert('Blog uploaded successfully');
//         form.reset();
//         window.location.href = '/profile/Dashbord/craete-Artical';
//       } else {
//         alert(res.data.message || 'Upload failed');
//       }

//     } catch (err) {
//       console.log(err.response?.data || err.message);
//       alert(err.response?.data?.message || 'Server error');
//     }

//     // uploading = false;
//     // btn.disabled = false;
//     // btn.innerText = 'Upload Blog Post';
//     // bar.style.width = '0%';
//     // text.innerText = '0%';
//     // progressBox.classList.add('hidden');
//   });
// }
