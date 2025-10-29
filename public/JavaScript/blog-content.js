
      let share

      const openPopup = () => {
       const currentUrl = window.location.href;
       const shareText = "Check out this article!";

        //  const currentUrl = encodeURIComponent(window.location.href);
  // const shareText = encodeURIComponent("Check out this article!");


        share = document.createElement("div")
        share.className = "fixed absolute inset-0 bg-black bg-opacity-50 z-50 h-screen flex items-center justify-center"

        share.innerHTML = `
       <div
      class="relative flex items-center justify-center flex-col bg-white shadow rounded-lg p-6 w-full max-w-md gap-6">

      <button id="xmarkIcon"  onclick="xmarkdown()" class="fixed top-12 right-12 bg-white p-2  z-[9999]">
        <img src="/assets/icons/xmark-solid-full.svg" alt="Close" class="h-10 w-10">
      </button>


      <!-- Input + copy icon -->
      <div class=" w-full">
        <div class="w-full gap-3 flex justify-center items-center">
          <input id="text"  class="border border-gray-900 p-2 w-80" readonly type="text" value="">
          <img  onclick="copyText()"  src="/assets/icons/paste-regular-full.svg" alt="copy"
            class="w-9 h-9 p-2 rounded-xl cursor-pointer border border-gray-900">
        </div>
        <div class="flex justify-center items-center gap-3">
          <div class="w-full gap-2 bg-white mt-6 shadow rounded-xl w-[600px] p-2">
            <div class="w-full flex gap-3 p-1 mb-2">
               <a href="fb-messenger://share/?link=${currentUrl}"><img src="/assets/icons/facebook-messenger-brands-solid-full.svg" alt="messinger"class="w-12 h-12"></a>
              <a href="https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}"><img src="/assets/icons/linkedin-brands-solid-full.svg" alt="linksdin" class="w-12 h-12"></a>
              <a href="https://www.snapchat.com/scan?attachmentUrl=${currentUrl}"><img src="/assets/icons/snapchat-brands-solid-full.svg" alt="snapchat" class="w-12 h-12"></a>
              <a href="https://t.me/share/url?url=${currentUrl}&text=${shareText}"><img src="/assets/icons/telegram-brands-solid-full.svg" alt="telegram" class="w-12 h-12"></a>
              <a href="#"><img src="/assets/icons/share-nodes-solid-full.svg" alt="share" class="w-12 h-12"></a>
              <a href="https://api.whatsapp.com/send?text=${shareText}%20${currentUrl}"><img src="/assets/icons/whatsapp-brands-solid-full.svg" class="w-12 h-12 " alt="WhatsApp"></a>
              </div>
            <div  id="extraIcons" class=" w-full flex  gap-2 min-w-max hidden">
              <a href="https://twitter.com/intent/tweet?text=${shareText}&url=${currentUrl}"><img src="/assets/icons/x-twitter-brands-solid-full.svg" class="w-12 h-12 "alt="Twitter/X"></a>
              <a href="https://www.instagram.com/"><img src="/assets/icons/instagram-brands-solid-full.svg" class="w-12 h-12 "alt="Instagram"></a>
              <a href="https://www.facebook.com/sharer/sharer.php?u=${currentUrl}"><img src="/assets/icons/facebook-brands-solid-full.svg" class="w-12 h-12 " alt="Facebook"></a>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&su=${shareText}&body=${currentUrl}"><img src="/assets/icons/google-brands-solid-full.svg" class="w-12 h-12 " alt="Google"></a>
            </div>
          </div>
          <div>
            <button onclick="toggleMoreIcons()" class="w-12 h-12 border border-gray-900 rounded-full p-1 flex justify-center items-center ">
            <img id="arrowIcon" src="/assets/icons/arrow-up-solid-full.svg" class="w-12 h-12 transition-transform duration-300 ease-in-out "alt="Arrow">
            </button>
          </div>
        </div>

      </div>

     </div>
      `

        document.body.appendChild(share)
        shareUrl()

      }


      const toggleMoreIcons = () => {
        const extra = document.querySelector("#extraIcons")
        const arrowIcon = document.querySelector("#arrowIcon")

        if (extra.classList.contains("hidden")) {
          extra.classList.remove("hidden")
          arrowIcon.style.transform = "rotate(0deg)"

        } else {
          extra.classList.add("hidden")
          arrowIcon.style.transform = "rotate(180deg)"
        }
      }

      const xmarkIcon = document.querySelector("#xmarkIcon")

      const xmarkdown = () => {
        if (share) {
          document.body.removeChild(share)

        }
      }



      const shareUrl = () =>{
        const text = document.querySelector("#text")
        text.value= window.location.href 
      }
      

      const copyText = () => {
        const text = document.querySelector("#text")
        try {
          navigator.clipboard.writeText(text.value)
        } catch (error) {
          console.log(error);

        }
      }
