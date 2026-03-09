
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("withdraw-btn")) return;

  const requestId = e.target.dataset.id;
  const action = e.target.dataset.action;

  console.log(requestId);
  console.log(action);
  

  if (!confirm(`Are you sure you want to ${action} this withdrawal?`)) return;

  try {
    const response = await fetch(`/api/admin-withdraw/withdraw/${requestId}/${action}`, {
      method: "POST",
      credentials: "include"
    });

    const data = await response.json();

    console.log(data);
    

    // if (!response.ok) {
    //   throw new Error(data.message || "Request failed");
    // }

    alert(data.message);
    location.reload();
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
});
