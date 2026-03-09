 (function(){
      const toggles = document.querySelectorAll('.toggle-password');
      toggles.forEach(icon => {
        icon.addEventListener('click', ()=>{
          const inputId = icon.getAttribute('toggle');
          const input = document.getElementById(inputId);
          if (!input) return;
          if (input.type === 'password'){
            input.type = 'text';
            icon.src = '/assets/icons/eye-solid-full.svg';
          } else {
            input.type = 'password';
            icon.src = '/assets/icons/eye-slash-solid-full.svg';
          }
        });
      });

      const form = document.querySelector('form');
      const pw = document.getElementById('Password');
      const cpw = document.getElementById('confirmPassword');
      const confirmError = document.getElementById('confirmError');
      form.addEventListener('submit', (e) => {
        if (pw.value.trim() === '' || cpw.value.trim() === '') return; // let server handle empties
        if (pw.value !== cpw.value){
          e.preventDefault();
          confirmError.classList.remove('hidden');
        }
      });
    })();