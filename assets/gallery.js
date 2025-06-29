// assets/gallery.js
fetch('data/items.json')
  .then(r => r.json())
  .then(items => {
    const gallery = document.getElementById('gallery');

    items.forEach(item => {
      const firstImage = `images/${item.images[0]}`;
      const el = document.createElement('article');
      el.innerHTML = `
        <span class="image">
          <img src="${firstImage}" alt="${item.title}">
        </span>
        <h2>${item.title}</h2>
        <p>${item.blurb}</p>
      `;
      el.onclick = () => openLightbox(item);
      gallery.appendChild(el);
    });

    /** simple slideshow modal */
    function openLightbox(item) {
      const slides = item.images.map(src =>
        `<img src="images/${src}" alt="${item.title}" style="max-width:100%">`
      ).join('');
      basicLightbox.create(`
        <div style="text-align:center">
          ${slides}
          <p>${item.tags.map(t => `<span class="tag">${t}</span>`).join(' ')}</p>
        </div>
      `).show();
    }
  });
