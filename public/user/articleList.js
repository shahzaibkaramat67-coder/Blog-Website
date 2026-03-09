 let page = 1; // first article already rendered on page



    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const articleContainer = document.getElementById("articleContainer");
    const category = loadMoreBtn.getAttribute("data-category")

    async function LoadArticles() {

        console.log("8wndowndowndiownokqw dl sjd d ");
        
        const res = await fetch(`/profile/list/${category}?page=${page}`);
        console.log("8wndowndowndiownokqw dl sjd d ");
        const dataArtical = await res.json();

        if (!dataArtical || dataArtical.length === 0) {
            loadMoreBtn.style.display = "none";
            return;
        }

        dataArtical.forEach(Artical => {
            const div = document.createElement("div");
            div.className = "bg-white p-4 rounded-xl shadow-lg flex flex-col sm:flex-row gap-4 mb-4 hover:shadow-xl transition";
            div.innerHTML = `
            <div class="flex-shrink-0">
                <img src="${Artical.featured_image}" alt="app" class="w-full sm:w-72 rounded-lg object-cover">
            </div>
            <div class="flex flex-col justify-between w-full">
                <div>
                    <h1 class="text-xl sm:text-2xl capitalize font-bold">${Artical.title}</h1>
                    <p class="text-gray-600 text-sm mt-1">${Artical.username ? Artical.username.username : "Unknown Author"}</p>
                    <p class="mt-3 text-gray-700 text-sm sm:text-base">${Artical.short_description}</p>
                </div>
                <div class="grid grid-cols-3 w-40 mt-3 text-gray-600 text-sm">
                    <div class="flex items-center cursor-pointer gap-1">
                        <img src="/assets/icons/thumbs-up-regular-full.svg" class="w-5 h-5">
                        <span>${Artical.totalLikes}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <img src="/assets/icons/eye-regular-full.svg" class="w-5 h-5">
                        <span>${Artical.totalViews}</span>
                    </div>
                    <div class="flex items-center cursor-pointer gap-1">
                        <img src="/assets/icons/share-nodes-solid-full.svg" class="w-5 h-5">
                        <span>${Artical.totalShares}</span>
                    </div>
                </div>
                
                    <div class="flex justify-end mt-3">
                        <a href="/blog/blog-contant/${Artical._id}"
                            class="read-more-btn  bg-teal-500 px-4 py-2 sm:px-6 sm:py-3 text-white font-bold uppercase rounded-lg hover:bg-teal-600 transition"
                            data-id="${Artical._id }">
                            Read More
                        </a>
                    </div>
            </div>
        `;
            articleContainer.appendChild(div);
        });

        page++;
    }

    loadMoreBtn.addEventListener("click", LoadArticles);