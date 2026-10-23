const view = document.getElementById("viewUpdate");

view.addEventListener("click", async() => {
  const api = await fetch("/updates/view", {
        method: "POST"
    });
  const countUpdate = api.json()
});