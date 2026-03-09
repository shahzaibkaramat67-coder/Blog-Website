
    const name = document.getElementById("title")
   
    const textarea = document.getElementById("textarea")

    const category = document.getElementById("category")
   
    const btn = document.getElementById("update")
    const updateForm = document.getElementById("updateForm")

    btn.addEventListener("click",async ()=>{
         const Categories = category.value.trim()

          const textName = name.value.trim()
              const discrib = textarea.value.trim()
        if (!textName || !discrib || !Categories) alert("All Fields are required")

        const res = await fetch("/api/admin-Announcements/update", {
            method : "post",
            headers :{'content-type': 'application/json'},
            body : JSON.stringify({textName, discrib, Categories})
        })
         
        if (res.success) {
            alert("post update successfully")
            updateForm.reset()
        }
        

        // const update =  res.json()


    })

   


