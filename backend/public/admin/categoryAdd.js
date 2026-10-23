const addTopic = document.getElementById("addTopic");
const topicsWrapper = document.getElementById("topicsWrapper");

let topicIndex = 0;

// Read RPM groups from data attribute
const rpmGroups = JSON.parse(topicsWrapper.dataset.rpmGroups || "[]");

addTopic.addEventListener("click", () => {

    let options = "";

    rpmGroups.forEach(group => {
        options += `
            <option value="${group._id}">
                ${group.name} 
            </option>
        `;
    });

    const topicHTML = `
        <div class="topic-row border p-4 rounded-lg bg-gray-50 space-y-3">
            
            <div>
                <label class="block text-sm font-medium">Topic Title</label>
                <input type="text" 
                    name="topics[${topicIndex}][title]" 
                    placeholder="Personal Finance"
                    required
                    class="title w-full border px-3 py-2 rounded" />
            </div>

            <div>
                <label class="block text-sm font-medium">Slug</label>
                <input type="text" 
                    name="topics[${topicIndex}][slug]" 
                    placeholder="personal-finance"
                    required
                    class="slug w-full border px-3 py-2 rounded" />
            </div>

            <div>
                <label class="block  text-sm font-medium">RPM Group</label>
                <select 
                    name="topics[${topicIndex}][rpm_group_id]" 
                    required
                    class="w-full  border px-3 py-2 rounded">
                    ${options}
                </select>
            </div>

            <button type="button" 
                class="removeTopic text-red-600 text-sm font-medium">
                Remove Topic
            </button>

        </div>
    `;

    topicsWrapper.insertAdjacentHTML("beforeend", topicHTML);

    topicIndex++;
});


// Remove topic
topicsWrapper.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".removeTopic");

    if (removeBtn) {
        removeBtn.closest(".topic-row").remove();
    }
});


// Auto slug generator
topicsWrapper.addEventListener("input", (e) => {

    if (e.target.classList.contains("title")) {

        const titleInput = e.target;
        const slugInput = titleInput
            .closest(".topic-row")
            .querySelector(".slug");

        slugInput.value = titleInput.value
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/--+/g, "-");
    }

});