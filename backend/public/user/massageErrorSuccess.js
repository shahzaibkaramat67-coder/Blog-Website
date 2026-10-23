 (function(){
            const container = document.getElementById('flash-container');
            if (!container) return;
            // Auto-dismiss after timeout per message
            const timeouts = [];
            container.querySelectorAll('.flash-popup').forEach((el, i) => {
                // staggered timeout so they don't disappear all at once
                const t = setTimeout(() => hide(el), 3500 + i * 300);
                timeouts.push(t);
            });

            function hide(el){
                el.classList.add('opacity-0','-translate-y-2');
                setTimeout(()=> el.remove(), 300);
            }

            container.addEventListener('click', function(e){
                if (e.target.closest('.flash-close')){
                    const item = e.target.closest('.flash-popup');
                    if (item) hide(item);
                }
            });

            // Remove timeouts when navigating away
            window.addEventListener('beforeunload', ()=> timeouts.forEach(t=>clearTimeout(t)));
        })();