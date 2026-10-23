const icons = document.querySelectorAll(".toggle-password")
icons.forEach(btn => {
    btn.addEventListener("click", () => {
        const container = btn.closest(".password-btn");   
        const input = container.querySelector("input");       
        const icon = btn;                                     

        if (input.type === "password") {
            input.type = "text";                              
            icon.src = "/assets/icons/eye-solid-full.svg";    
        } else {
            input.type = "password";                         
            icon.src = "/assets/icons/eye-slash-solid-full.svg"; 
        }
    });
})


