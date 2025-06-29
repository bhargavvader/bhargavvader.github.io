// ───────────────────────────────── assets/gallery.js ───────────────────────
import PhotoSwipeLightbox from
  'https://unpkg.com/photoswipe@5/dist/photoswipe-lightbox.esm.js';

fetch('data/items.json')
  .then(r => r.json())
  .then(items => {

    /* ---------- build masonry thumbnails ---------- */
    const g      = document.getElementById('gallery');
    const slides = [];                                 // master slide list

    items.forEach(item => {
      // find the first image for the cover
      const firstImg = (item.media || []).find(m => m.type === 'image');
      if (!firstImg) return;                           // skip if no pictures

      /* masonry card ------------------------------------------------------- */
      const card = document.createElement('div');
      card.className = 'masonry-item';
      card.innerHTML = `
        <a  href="${firstImg.src}" data-pswp-width="1600" data-pswp-height="1200"
            data-index="${slides.length}">
          <img src="${firstImg.src}" alt="${item.title}">
        </a>
        <h2>${item.title}</h2>
        <p>${item.year ?? ''}</p>`;
      g.appendChild(card);

      /* register **all** images of this work for PhotoSwipe --------------- */
      item.media
          .filter(m => m.type === 'image')
          .forEach(m => slides.push({
              src   : m.src,
              w     : 1600,              // ← put real dims if you have them
              h     : 1200,
              title : item.title,
              item  : item              // backlink for the info-panel
          }));
    });

    /* ---------- PhotoSwipe lightbox ---------- */
    const lightbox = new PhotoSwipeLightbox({
      gallery    : '#gallery',
      children   : 'a',
      pswpModule : () => import('https://unpkg.com/photoswipe@5')
    });

    // hand PhotoSwipe our custom slide objects
    lightbox.on('itemData', e => Object.assign(e.itemData, slides[e.index]));

    /* ---------- info panel (extra metadata) ---------- */
    lightbox.on('afterInit', () => {
      const panel = document.createElement('div');
      panel.id = 'info-panel';
      document.body.appendChild(panel);

      // update content on every slide change
      lightbox.on('change', ({ index }) => {
        const it = slides[index].item;                 // ← easy now!
        panel.innerHTML = `
          <h3>${it.title}</h3>
          <p><strong>Year:</strong> ${it.year}<br>
             <strong>Materials:</strong> ${it.materials}</p>
          <p>${it.description || it.Description || ''}</p>`;
      });
    });

    lightbox.init();   // keep this last

  })
  .catch(err => console.error('Gallery load error:', err));
