  const otpForm = document.querySelector('.otpForm');
    const otpdigit = document.querySelectorAll('.otp-digit');
    const otpInput = document.querySelector('#otpInput')

    otpdigit.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        const otp = e.target.value
        // just Number Allow
        if (!/^[0-9]$/.test(otp)) {
          e.target.value = ""
          return;
        }

        if (index < otpdigit.length - 1) {
          otpdigit[index + 1].focus()
        }

      })

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
          otpdigit[index - 1].focus();
        }
      })

      input.addEventListener("paste", (e) => {
        // Allow pasting full code: distribute pasted digits across inputs
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
        const digits = paste.replace(/\D/g, '').slice(0, otpdigit.length).split('');
        digits.forEach((ch, i) => {
          otpdigit[i].value = ch;
        });
        const nextIndex = Math.min(digits.length, otpdigit.length) - 1;
        if (nextIndex >= 0 && nextIndex < otpdigit.length) otpdigit[nextIndex].focus();
      });
    });

    otpForm.addEventListener("submit", (e)=>{
        const inputArray = Array.from(otpdigit).map(i => i.value).join("")
    otpInput.value = inputArray

    })
    