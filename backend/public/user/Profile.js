
// document.addEventListener("DOMContentLoaded", () => {

//   const form = document.querySelector("form");

//   const validators = {
//     full_name: (value) => {
//       if (!value) return "Full name is required";
//       if (/\s/.test(value)) return "No spaces allowed";
//       if (value.length < 5 || value.length > 15) return "Must be 5-15 characters";
//       if (!/^[a-zA-Z0-9]+$/.test(value)) return "Only letters and numbers allowed";
//       return null;
//     },

//     username: (value) => {
//       if (!value) return null; // optional
//       if (/\s/.test(value)) return "No spaces allowed";
//       if (value.length < 5 || value.length > 15) return "Must be 5-15 characters";
//       if (!/^[a-zA-Z0-9]+$/.test(value)) return "Only letters and numbers allowed";
//       return null;
//     },

//     about: (value) => {
//       if (!value) return "About is required";
//       if (value.length < 5 || value.length > 500) return "Must be 5-500 characters";
//       if (!/^[A-Za-z ,.?'!"]+$/.test(value)) return "Invalid characters";
//       return null;
//     },

//     email: (value) => {
//       if (!value) return null;
//       if (/\s/.test(value)) return "No spaces allowed";
//       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
//       if (!value.endsWith("@gmail.com")) return "Only Gmail allowed";
//       return null;
//     },

//     phone: (value) => {
//       if (!value) return null;
//       if (/\s/.test(value)) return "No spaces allowed";
//       if (!/^\+?[0-9]{7,15}$/.test(value)) return "Invalid phone number";
//       return null;
//     },

//     website: (value) => {
//       if (!value) return null;
//       if (!value.startsWith("https://")) return "Must start with https://";
//       if (value.startsWith("javascript:") || value.startsWith("data:")) return "Invalid URL";
//       return null;
//     }
//   };

//   function setError(input, message) {
//     input.classList.add("border-red-500");
//     input.classList.remove("border-gray-300");

//     const errorText = input.nextElementSibling;
//     errorText.textContent = message;
//     errorText.classList.remove("hidden");
//   }

//   function clearError(input) {
//     input.classList.remove("border-red-500");
//     input.classList.add("border-gray-300");

//     const errorText = input.nextElementSibling;
//     errorText.textContent = "";
//     errorText.classList.add("hidden");
//   }

//   // 🔥 Real-time validation
//   Object.keys(validators).forEach((field) => {
//     const input = document.querySelector(`[name="${field}"]`);
//     if (!input) return;

//     input.addEventListener("input", () => {
//       const error = validators[field](input.value.trim());

//       if (error) {
//         setError(input, error);
//       } else {
//         clearError(input);
//       }
//     });
//   });

//   // 🔥 On submit
//   form.addEventListener("submit", (e) => {
//     let hasError = false;

//     Object.keys(validators).forEach((field) => {
//       const input = document.querySelector(`[name="${field}"]`);
//       if (!input) return;

//       const error = validators[field](input.value.trim());

//       if (error) {
//         setError(input, error);
//         hasError = true;
//       } else {
//         clearError(input);
//       }
//     });

//     if (hasError) {
//       e.preventDefault();
//     }
//   });

// });
