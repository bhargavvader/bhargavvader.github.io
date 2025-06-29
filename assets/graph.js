fetch('data/items.json')
  .then(r => r.json())
  .then(items => {
    // build nodes
    const nodes = items.map((it, i) => ({
      id: i,
      label: it.title,
      title: it.blurb
    }));

    // build edges when two items share at least one tag
    const edges = [];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const overlap = items[i].tags.filter(t => items[j].tags.includes(t));
        if (overlap.length) edges.push({ from: i, to: j, label: overlap[0] });
      }
    }

    const container = document.getElementById('graph');
    const network = new vis.Network(container, { nodes, edges }, {
      interaction: { hover: true },
      physics: { stabilization: false }
    });

    // click node → focus item in gallery
    network.on('doubleClick', params => {
      const id = params.nodes[0];
      if (id !== undefined) window.location.href = `index.html#${items[id].slug}`;
    });
  });
