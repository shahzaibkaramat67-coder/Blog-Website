

const articalId = document.querySelector("#articalId").value;
const commentForm = document.querySelector("#comments-form");
const commentText = document.querySelector("#commentText");
const commentsList = document.querySelector("#comments-list");

// Render a single comment
const renderComment = (comment) => {
  const div = document.createElement("div");
  div.className = "w-full shadow-lg rounded-lg mt-3";
  div.innerHTML = `
    <div class="pt-6 px-6 flex items-center justify-between">
      <div class="flex gap-3 items-center">
        <img class="w-10 rounded-xl" loading="lazy" alt="Description" src="${comment.comment_image}" alt="comment_image">
        <p>${comment.username}</p>
      </div>
      <button class="delete-comment" data-id="${comment._id}">
        <img class="w-10 cursor-pointer" src="/assets/icons/xmark-solid-full.svg" alt="xmark">
      </button>
    </div>
    <p class="p-6">${comment.Comment}</p>
  `;
  commentsList.prepend(div); // newest comment on top
  
};

// Load all comments for this article
const loadComments = async () => {
  try {
    const res = await fetch(`/blog/blog-contant/${articalId}/comments`);
    const data = await res.json();
    if (data.success && data.comments.length) {
      commentsList.innerHTML = ""; // clear existing
      data.comments.forEach(renderComment);
    }
    //  else {
    //   commentsList.innerHTML = "<p class='text-gray-500'>No comments yet.</p>";
    // }
  } catch (err) {
    console.error("Error fetching comments:", err);
  }
};

// Submit new comment
commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = commentText.value.trim();
  if (!text) return alert("Comment cannot be empty");

  try {
    const res = await fetch("/blog/blog-contant/submit-comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articalId, text })
    });
    const data = await res.json();
    if (data.success) {
      renderComment(data.newComments); // add new comment to page
      commentText.value = "";
    }
  } catch (err) {
    console.error("Error submitting comment:", err);
  }
});

// Delete comment
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".delete-comment");
  if (!btn) return;
  const commentId = btn.dataset.id;

  try {
    const res = await fetch(`/blog/blog-contant/delete-comment/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (data.success) btn.closest(".w-full").remove();
  } catch (err) {
    console.error("Error deleting comment:", err);
  }
});

// Initial load
document.addEventListener("DOMContentLoaded", loadComments);













// const comments = document.getElementById("comments");
// comments.addEventListener("submit", async function (e){
//     e.preventDefault();

//     const text = document.getElementById("text").value
//     const id = document.getElementById("id").value

//     const res =await fetch("/comment", {
//            method: "POST",
//     headers: { "Content-Type": "application/json" },
//        body: JSON.stringify({ text, articalId : id })
//     })

//     if (res.ok) {
//         document.getElementById("text").value="";
//           location.reload(); 
//     }
// })