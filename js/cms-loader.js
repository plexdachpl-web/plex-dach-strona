(async function () {
  try {
    const res = await fetch('/content/site.json');
    if (!res.ok) return;
    const data = await res.json();

    document.querySelectorAll('[data-cms]').forEach(el => {
      const key = el.getAttribute('data-cms');
      const value = data[key];
      if (value === undefined) return;

      if (el.tagName === 'TITLE') {
        document.title = value;
      } else if (el.hasAttribute('href') && el.getAttribute('href').startsWith('tel:')) {
        el.href = 'tel:' + data['phone'];
      } else {
        el.textContent = value;
      }
    });

    // Phone links (href)
    if (data.phone) {
      document.querySelectorAll('a[href^="tel:"]').forEach(a => {
        a.href = 'tel:' + data.phone;
      });
    }

    // Inject subpage links into nav if pages exist
    try {
      const pagesRes = await fetch('/content/pages/index.json');
      if (pagesRes.ok) {
        const pages = await pagesRes.json();
        const slot = document.getElementById('nav-subpages-slot');
        if (slot && pages.length) {
          pages.forEach(p => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '/strona.html?s=' + p.slug;
            a.textContent = p.title;
            li.appendChild(a);
            slot.parentNode.insertBefore(li, slot);
          });
          slot.remove();
        }
      }
    } catch (_) {}

  } catch (e) {
    console.warn('CMS loader:', e);
  }
})();
