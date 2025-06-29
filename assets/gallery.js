/* ─────────────────────────── assets/gallery.js ────────────────────────── */
import PhotoSwipeLightbox from
  'https://unpkg.com/photoswipe@5/dist/photoswipe-lightbox.esm.js';

fetch('data/items.json')
  .then(r => r.json())
  .then(items => {

    const gallery   = document.getElementById('gallery');
    const slides    = [];           // master list for PhotoSwipe
    const indexMap  = [];           // slide-index  → item-index

    /* ---------- build masonry grid & prepare slides -------------------- */
    items.forEach((item, itemIdx) => {

      const imgs = (item.media || []).filter(m => m.type === 'image');
      if (!imgs.length) return;                 // skip entries with no images

      const cover = imgs[0].src;                // first image → thumbnail

      /* masonry element */
      const el = document.createElement('div');
      el.className = 'masonry-item';
      el.innerHTML = `
        <a href="${cover}" data-pswp-width="1600" data-pswp-height="1200"
           data-index="${slides.length}">
          <img src="${cover}" alt="${item.title}">
        </a>
        <h2>${item.title}</h2>
        <p>${item.year ?? ''}</p>`;
      gallery.appendChild(el);

      /* every image of this work becomes a slide */
      imgs.forEach(img => {
        slides.push({ src: img.src, w: 1600, h: 1200, title: item.title });
        indexMap.push(itemIdx);     // remember which item this slide belongs to
      });
    });

    /* ---------- PhotoSwipe light-box ----------------------------------- */
    const lightbox = new PhotoSwipeLightbox({
      gallery    : '#gallery',
      children   : 'a',
      pswpModule : () => import('https://unpkg.com/photoswipe@5')
    });

    // Supply our slide objects
    lightbox.on('itemData', e => Object.assign(e.itemData, slides[e.index]));

    lightbox.init();      // initialise before adding afterInit handler

    /* ---------- info panel (extra metadata) ---------------------------- */
    lightbox.on('afterInit', () => {
      const panel = document.createElement('div');
      panel.id = 'info-panel';
      document.body.appendChild(panel);

      const updatePanel = idx => {
        const item = items[indexMap[idx]];
        if (!item) return;

        panel.innerHTML = `
          <h3>${item.title}</h3>
          <p>
            <strong>Year:</strong> ${item.year ?? '—'}<br>
            <strong>Materials:</strong> ${item.materials ?? '—'}
          </p>
          <p>${item.description || item.Description || ''}</p>`;
      };

      updatePanel( lightbox.pswp.currIndex );   // show for first slide
      lightbox.on('change', ({ index }) => updatePanel(index));
    });
  })
  .catch(err => console.error('Gallery load error:', err));
