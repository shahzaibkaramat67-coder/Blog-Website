 (function () {
      if (!document.getElementById('page-loader-style')) {
        const style = document.createElement('style');
        style.id = 'page-loader-style';
        style.textContent = `
          #page-loader{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.92);backdrop-filter:blur(6px);z-index:99999;opacity:0;pointer-events:none;transition:opacity .18s ease}
          #page-loader.show{opacity:1;pointer-events:auto}
          #page-loader .spinner{width:52px;height:52px;border-radius:50%;border:5px solid rgba(0,0,0,.08);border-top-color:#10b981;animation:spin .9s linear infinite}
          @keyframes spin{to{transform:rotate(360deg)}}
        `;
        document.head.appendChild(style);
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = '<div class="spinner" aria-hidden="true"></div>';
        document.body.appendChild(loader);
      }

      const loaderEl = document.getElementById('page-loader');
      const show = () => loaderEl && loaderEl.classList.add('show');
      const hide = () => loaderEl && loaderEl.classList.remove('show');

      function shouldHandleAnchor(a, ev) {
        if (!a) return false;
        const href = a.getAttribute('href') || '';
        if (!href) return false;
        if (a.hasAttribute('download')) return false;
        if (a.target && a.target !== '_self') return false;
        if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return false;
        if (ev && (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey)) return false;
        try {
          const url = new URL(href, location.href);
          if (url.origin !== location.origin) return false;
        } catch (err) {
          return false;
        }
        return true;
      }

      document.addEventListener('click', function (ev) {
        const a = ev.target.closest && ev.target.closest('a');
        if (!shouldHandleAnchor(a, ev)) return;
        ev.preventDefault();
        show();
        const url = a.href;
        setTimeout(() => (location.href = url), 50);
      }, { passive: false });

      document.addEventListener('submit', function (ev) {
      if (form.classList.contains('js-ajax')) return;  
        if (ev.defaultPrevented) return;
        show();
      }, true);

      window.addEventListener('pageshow', function (e) { if (e.persisted) hide(); hide(); });

      window.showPageLoader = show;
      window.hidePageLoader = hide;
    })();