const validators = {

    full_name: {
        regex: /^[a-zA-Z\s]{3,50}$/,
        success: "Looks good ✓",
        error: "Name must be 3–50 letters only"
    },

    username: {
        regex: /^[a-zA-Z0-9_]{3,20}$/,
        success: "Valid username ✓",
        error: "3–20 characters (letters, numbers, underscore only)"
    },

    phone: {
        regex: /^(\+92|0)[0-9]{10}$/,
        success: "Valid phone number ✓",
        error: "Format: +923XXXXXXXXX or 03XXXXXXXXX"
    },

    location: {
        regex: /^[a-zA-Z\s,]{3,60}$/,
        success: "Valid location ✓",
        error: "Example: Lahore, Pakistan"
    },

    website: {
        regex: /^(https:\/\/)?([\w\d\-]+\.)+\w{2,}$/,
        success: "Valid website ✓",
        error: "Must be valid URL (https://example.com)"
    }

}


function validateField(fieldId) {

    const input = document.getElementById(fieldId)

    if (!input) return

    const message = document.getElementById(fieldId + "_msg")

    input.addEventListener("input", () => {

        const value = input.value.trim()

        if (value === "") {
            message.className = "text-xs mt-1 text-gray-400"
            return
        }

        const rule = validators[fieldId]

        if (!rule) return


        if (rule.regex.test(value)) {

            message.textContent = rule.success
            message.className = "text-xs mt-1 text-green-600"

        } else {

            message.textContent = rule.error
            message.className = "text-xs mt-1 text-red-600"

        }

    })

}


Object.keys(validators).forEach(validateField)