  const fileFromInput = document.querySelector("#profileImage")
        const imageToPlace = document.querySelector("#profilePreview")

        imageToPlace.addEventListener('click', () => {
            fileFromInput.click()
        })


        fileFromInput.addEventListener('change', (e) => {
            const files = e.target.files[0]
            if (files) {
                const reader = new FileReader()
                reader.onload = () => {
                    imageToPlace.src = reader.result;
                }

                reader.readAsDataURL(files)
            }

        })


        const Dropdownbtn = document.querySelector("#Dropdownbtn")
        const DropdownManu = document.querySelector("#DropdownManu")

        Dropdownbtn.addEventListener("click", (e) => {
            e.preventDefault();
            DropdownManu.classList.toggle("hidden")

        })
        document.addEventListener("click", (e) => {
            if (!Dropdownbtn.contains(e.target) && !DropdownManu.contains(e.target)) {
                DropdownManu.classList.add("hidden")

            }
        })

        // let box = []
        const checkbox = document.querySelectorAll('[type="checkbox"]')
        checkbox.forEach(cb => {
            cb.addEventListener("change", () => {
                const checked = document.querySelectorAll('[type="checkbox"]:checked')
                // box = Array.from(checkbox).filter(c => c.checked).map(c => c.value)
                // console.log('this is checked list', box);
               if (checked.length >= 6) {
               checkbox.forEach(box =>{
                if (!box.checked) {
                     box.disabled = true
                }
               })
               }else{
                checkbox.forEach(box =>  box.disabled = false
                
            )}

            })
            // alert("you can not select upto 6 category")

        })


