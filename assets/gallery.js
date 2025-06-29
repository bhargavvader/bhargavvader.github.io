// assets/gallery.js ---------------------------------------------------------
import PhotoSwipeLightbox from
  'https://unpkg.com/photoswipe@5/dist/photoswipe-lightbox.esm.js';

fetch('data/items.json')
  .then(r => r.json())
  .then(items => {

    /* ---------- build masonry thumbnails ---------- */
    const g = document.getElementById('gallery');
    const slides = [];             // master slide list for PhotoSwipe

    items.forEach(item => {
      const cover = `images/${item.images[0]}`;

      // masonry element
      const el = document.createElement('div');
      el.className = 'masonry-item';
      el.innerHTML = `
        <a href="${cover}" data-pswp-width="1600" data-pswp-height="1200"
           data-index="${slides.length}">
          <img src="${cover}" alt="${item.title}">
        </a>
        <h2>${item.title}</h2>
        <p>${item.year ?? ''}</p>`;
      g.appendChild(el);

      // register every image of this work
      item.images.forEach(src => slides.push({
        src: `images/${src}`,
        w  : 1600,
        h  : 1200,
        title : item.title
      }));
    });

    /* ---------- PhotoSwipe lightbox ---------- */
    const lightbox = new PhotoSwipeLightbox({
      gallery    : '#gallery',
      children   : 'a',
      pswpModule : () => import('https://unpkg.com/photoswipe@5')
    });

    // feed PhotoSwipe our custom slide objects
    lightbox.on('itemData', e => Object.assign(e.itemData, slides[e.index]));

    lightbox.init();   // MUST come before afterInit listener!

    /* ---------- info panel (extra metadata) ---------- */
    lightbox.on('afterInit', () => {
      const panel = document.createElement('div');
      panel.id = 'info-panel';
      document.body.appendChild(panel);

      // update content on every slide change
      lightbox.on('change', ({ index }) => {
        const item = items[Math.floor(index)];   // 1 slide per img
        panel.innerHTML = `
          <h3>${item.title}</h3>
          <p><strong>Year:</strong> ${item.year}<br>
             <strong>Materials:</strong> ${item.materials}</p>
          <p>${item.description || ''}</p>`;
      });
    });

  })
  .catch(err => console.error('Gallery load error:', err));
