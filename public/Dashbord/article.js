const form = document.getElementById('uploadForm');

if (form) {
  const bar = document.getElementById('progressBar');
  const text = document.getElementById('progressText');
  const progressBox = document.getElementById('progressBox');
  const btn = document.getElementById('uploadBtn');

  let uploading = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (uploading) return;

    uploading = true;
    btn.disabled = true;
    btn.innerText = 'Uploading...';
    progressBox.classList.remove('hidden');

    const formData = new FormData(form);

    try {
      const res = await axios.post('/profile/Dashbord/craete-Artical/upload-blog', formData, {
        onUploadProgress: (p) => {
          if (!p.total) return;
          const percent = Math.round((p.loaded * 100) / p.total);
          bar.style.width = percent + '%';
          text.innerText = percent + '%';
        }
      });

      if (res.data.success) {
        alert('Blog uploaded successfully');
        form.reset();
      } else {
        alert(res.data.message || 'Upload failed');
      }

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.message || 'Server error');
    }

    uploading = false;
    btn.disabled = false;
    btn.innerText = 'Upload Blog Post';
    bar.style.width = '0%';
    text.innerText = '0%';
    progressBox.classList.add('hidden');
  });
}
