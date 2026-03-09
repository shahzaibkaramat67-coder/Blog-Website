let container;

const message = document.querySelectorAll(".message-row");

message.forEach(row => {
    row.addEventListener("click", () => {
        const id = row.dataset.id;
        const name = row.dataset.name;
        const email = row.dataset.email;
        const subject = row.dataset.subject;
        const messageText = row.dataset.messageText;
        const date = row.dataset.date;

        console.log("id", id);

        markAsRead(id);
        showPopup(name, email, subject, messageText, date, row);
    });
});


function showPopup(name, email, subject, messageText, date, row) {

    container = document.getElementById("messagePopup");

    container.innerHTML = `
    <div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl h-4/5 flex flex-col overflow-hidden">
    
    <div class="flex justify-between items-start p-4 border-b">
    <div>
                        <h2 class="text-2xl font-bold mb-2">${subject}</h2>
                        <p class="text-gray-600"><b>From:</b> ${name}</p>
                        <p class="text-gray-600"><b>Email:</b> ${email}</p>
                        <p class="text-gray-500"><b>Date:</b> ${date}</p>
                    </div>
                    <button class="closePopup text-red-500 text-3xl font-bold">&times;</button>
                    </div>

                <div class="p-6 overflow-y-auto flex-1 text-gray-700">
                    <p class="font-normal whitespace-pre-wrap">${messageText}</p>
                </div>

                <div class="flex justify-end p-4 border-t">
                    <button class="closePopup bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Close</button>
                </div>

                </div>
                </div>
                `;

    container.querySelectorAll(".closePopup").forEach(btn => {
        btn.addEventListener("click", () => {
            container.innerHTML = "";

        });
    });
    row.classList.remove("font-semibold");
    // attach close events AFTER popup exists
}


async function markAsRead(id) {

    console.log("this id from markAsRead", id);

    const res = await fetch(`/api/admin-messages/message/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await res.json();
    console.log(data);
}