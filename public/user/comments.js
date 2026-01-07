

const comments = document.getElementById("comments");
comments.addEventListener("submit", async function (e){
    e.preventDefault();

    const text = document.getElementById("text").value
    const id = document.getElementById("id").value

    const res =await fetch("/comment", {
           method: "POST",
    headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ text, articalId : id })
    })

    if (res.ok) {
        document.getElementById("text").value="";
          location.reload(); 
    }
})