document.addEventListener("DOMContentLoaded", () => {

    let showGroup = window.showGroup || [];
    console.log("showGroup", showGroup);

    let topicIndex = 0;

    const addTopicBtn = document.getElementById("addTopic");
    const topicsWrapper = document.getElementById("topicsWrapper");

    addTopicBtn.addEventListener("click", addTopic);

    // Create the first topic row automatically
    addTopic();

    function addTopic() {

        // Build RPM group options dynamically
        let optionsHTML = `<option value="" disabled selected>Select the group</option>`;
        if (showGroup.length > 0) {
            showGroup.forEach(group => {
                optionsHTML += `<option value="${group._id}">${group.name}</option>`;
            });
        } else {
            optionsHTML += `<option>No data found</option>`;
        }

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
                <label class="block text-sm font-medium">RPM Group</label>
                <select name="topics[${topicIndex}][rpm_group_id]" 
                        required 
                        class="w-full border px-3 py-2 rounded">
                    ${optionsHTML}
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
    }

    // Remove topic (delegation)
    topicsWrapper.addEventListener("click", (e) => {
        if (e.target.classList.contains("removeTopic")) {
            e.target.closest(".topic-row").remove();
        }
    });

    // Auto-generate slug
    topicsWrapper.addEventListener("input", (e) => {
        if (e.target.classList.contains("title")) {
            const inputTitle = e.target;
            const inputSlug = inputTitle.closest(".topic-row").querySelector(".slug");
            inputSlug.value = inputTitle.value
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/--+/g, "-");
        }
    });

});