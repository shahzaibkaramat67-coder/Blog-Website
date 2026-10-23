document.addEventListener("DOMContentLoaded", () => {

  /* ================= Toggle Password ================= */
  const toggle = document.querySelectorAll('.toggle-password');

  toggle.forEach((icon) => {
    icon.addEventListener('click', () => {
      const inputId = icon.getAttribute("toggle");
      const input = document.getElementById(inputId);

      if (input) {
        const currenttype = input.getAttribute('type');
        if (currenttype === 'text') {
          input.setAttribute('type', 'password');
          icon.src = '/assets/icons/eye-slash-solid-full.svg';
        } else {
          input.setAttribute('type', 'text');
          icon.src = '/assets/icons/eye-solid-full.svg';
        }
      }
    });
  });

  /* ================= Validation ================= */

  const stateClasses = {
    red: { help: "text-red-600", border: "border-red-500" },
    green: { help: "text-emerald-600", border: "border-emerald-500" },
  };

  function setState(input, help, msg, state) {
    const classes = stateClasses[state] || stateClasses.red;

    help.textContent = msg;
    help.classList.remove("text-red-600", "text-emerald-600");
    help.classList.add(classes.help);

    input.classList.remove("border-slate-200", "border-red-500", "border-emerald-500");
    input.classList.add(classes.border);
  }

  const nameRegex = /^[A-Za-z][A-Za-z0-9]{2,9}$/;
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fields = [
    { id: "Username", regex: nameRegex, msg: "5-10 chars, start with letter, letters & numbers" },
    { id: "email", regex: emailRegex, msg: "Enter valid email like: abc@gmail.com" },
    { id: "password", regex: strongPasswordRegex, msg: "8–20 chars, upper, lower, number & special" },
  ];

  fields.forEach(field => {
    const input = document.getElementById(field.id);
    const error = document.getElementById(field.id + "Error");

    if (!input || !error) return;

    setState(input, error, field.msg, "red");

    input.addEventListener("input", () => {
      if (field.regex.test(input.value)) {
        setState(input, error, "Looks good!", "green");
      } else {
        setState(input, error, field.msg, "red");
      }
    });
  });

  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const confirmPasswordError = document.getElementById("confirmPasswordError");

  if (password && confirmPassword && confirmPasswordError) {
    setState(confirmPassword, confirmPasswordError, "Passwords must match", "red");

    confirmPassword.addEventListener("input", () => {
      if (confirmPassword.value === password.value && confirmPassword.value.trim() !== "") {
        setState(confirmPassword, confirmPasswordError, "Looks good!", "green");
      } else {
        setState(confirmPassword, confirmPasswordError, "Passwords must match", "red");
      }
    });
  }

});




//    <script>
// document.addEventListener("DOMContentLoaded", () => {

//   /* ================= Toggle Password ================= */
//   const toggle = document.querySelectorAll('.toggle-password');

//   toggle.forEach((icon) => {
//     icon.addEventListener('click', () => {
//       const inputId = icon.getAttribute("toggle");
//       const input = document.getElementById(inputId);

//       if (input) {
//         const currenttype = input.getAttribute('type');
//         if (currenttype === 'text') {
//           input.setAttribute('type', 'password');
//           icon.src = '/assets/icons/eye-slash-solid-full.svg';
//         } else {
//           input.setAttribute('type', 'text');
//           icon.src = '/assets/icons/eye-solid-full.svg';
//         }
//       }
//     });
//   });

//   /* ================= Validation ================= */

//   const stateClasses = {
//     red: { help: "text-red-600", border: "border-red-500" },
//     green: { help: "text-emerald-600", border: "border-emerald-500" },
//   };

//   function setState(input, help, msg, state) {
//     const classes = stateClasses[state] || stateClasses.red;

//     help.textContent = msg;
//     help.classList.remove("text-red-600", "text-emerald-600");
//     help.classList.add(classes.help);

//     input.classList.remove("border-slate-200", "border-red-500", "border-emerald-500");
//     input.classList.add(classes.border);
//   }

//   const nameRegex = /^[A-Za-z][A-Za-z0-9]{2,9}$/;
//   const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/;
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   const fields = [
//     { id: "Username", regex: nameRegex, msg: "5-10 chars, start with letter, letters & numbers" },
//     { id: "email", regex: emailRegex, msg: "Enter valid email like: abc@gmail.com" },
//     { id: "password", regex: strongPasswordRegex, msg: "8–20 chars, upper, lower, number & special" },
//   ];

//   fields.forEach(field => {
//     const input = document.getElementById(field.id);
//     const error = document.getElementById(field.id + "Error");

//     if (!input || !error) return;

//     setState(input, error, field.msg, "red");

//     input.addEventListener("input", () => {
//       if (field.regex.test(input.value)) {
//         setState(input, error, "Looks good!", "green");
//       } else {
//         setState(input, error, field.msg, "red");
//       }
//     });
//   });

//   const password = document.getElementById("password");
//   const confirmPassword = document.getElementById("confirmPassword");
//   const confirmPasswordError = document.getElementById("confirmPasswordError");

//   if (password && confirmPassword && confirmPasswordError) {
//     setState(confirmPassword, confirmPasswordError, "Passwords must match", "red");

//     confirmPassword.addEventListener("input", () => {
//       if (confirmPassword.value === password.value && confirmPassword.value.trim() !== "") {
//         setState(confirmPassword, confirmPasswordError, "Looks good!", "green");
//       } else {
//         setState(confirmPassword, confirmPasswordError, "Passwords must match", "red");
//       }
//     });
//   }

// });
// </script>