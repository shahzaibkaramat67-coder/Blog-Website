document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("form");

  const validators = {
    full_name: (value) => {
      if (!value) return false;
      if (/\s/.test(value)) return false;
      if (value.length < 5 || value.length > 15) return false;
      if (!/^[a-zA-Z0-9]+$/.test(value)) return false;
      return true;
    },

    username: (value) => {
      if (!value) return true; // optional
      if (/\s/.test(value)) return false;
      if (value.length < 5 || value.length > 15) return false;
      if (!/^[a-zA-Z0-9]+$/.test(value)) return false;
      return true;
    },

    about: (value) => {
      if (!value) return false;
      if (value.length < 5 || value.length > 500) return false;
      if (!/^[A-Za-z ,.?'!"]+$/.test(value)) return false;
      return true;
    },

    email: (value) => {
      if (!value) return true;
      if (/\s/.test(value)) return false;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return false;
      if (!value.endsWith("@gmail.com")) return false;
      return true;
    },

    phone: (value) => {
      if (!value) return true;
      if (/\s/.test(value)) return false;
      if (!/^\+?[0-9]{7,15}$/.test(value)) return false;
      return true;
    },

    website: (value) => {
      if (!value) return true;
      if (!value.startsWith("https://")) return false;
      if (value.startsWith("javascript:") || value.startsWith("data:")) return false;
      return true;
    }
  };

  function markInvalid(input) {
    input.classList.add("border-red-500");
    input.classList.remove("border-gray-300");
  }

  function markValid(input) {
    input.classList.remove("border-red-500");
    input.classList.add("border-gray-300");
  }

  // 🔥 Real-time validation
  Object.keys(validators).forEach((field) => {
    const input = document.querySelector(`[name="${field}"]`);
    if (!input) return;

    input.addEventListener("input", () => {
      const isValid = validators[field](input.value.trim());

      if (!isValid) {
        markInvalid(input);
      } else {
        markValid(input);
      }
    });
  });

  // 🔥 On submit
  form.addEventListener("submit", (e) => {
    let hasError = false;

    Object.keys(validators).forEach((field) => {
      const input = document.querySelector(`[name="${field}"]`);
      if (!input) return;

      const isValid = validators[field](input.value.trim());

      if (!isValid) {
        markInvalid(input);
        hasError = true;
      } else {
        markValid(input);
      }
    });

    if (hasError) {
      e.preventDefault();
    }
  });

});




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


