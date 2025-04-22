// 1) searchResults(html) — returns [{ title, image, href }]
function searchResults(html) {
  const items = html.match(/<div class="result-item">[\s\S]*?<\/article>/g) || [];
  return items.map(item => {
    const href  = (item.match(/<div class="thumbnail[\s\S]*?<a href="([^"]+)"/)    || [,''])[1].trim();
    const title = (item.match(/<div class="title">[\s\S]*?<a[^>]*>([^<]+)<\/a>/) || [,''])[1].trim();
    const image = (item.match(/<img[^>]+src="([^"]+)"/)                           || [,''])[1].trim();
    return { title, image, href };
  });
}

// 2) extractDetails(html) — returns { description, aliases, airdate }
function extractDetails(html) {
  const description = (html.match(/<div class="contenido">[\s\S]*?<p>([\s\S]*?)<\/p>/) || [,''])[1].trim();
  // WatchHentai doesn’t expose an “alternative title” field, so leave aliases null
  const airdate     = (html.match(/<div class="meta">[\s\S]*?<span class="year">([^<]+)<\/span>/) || [,''])[1].trim();
  return { description, aliases: null, airdate };
}

function extractEpisodes(html) {
  const eps = [];

  // 1) Match the <ul class="episodios">…</ul>
  const ulMatch = html.match(
    /<ul[^>]*class="[^"]*episodios[^"]*"[^>]*>([\s\S]*?)<\/ul>/i
  );
  if (ulMatch) {
    const listHtml = ulMatch[1];

    // 2) Pull href & number in one shot
    const liRe = /<li[\s\S]*?>[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>(?:\s*Episode\s*)?(\d+)[\s\S]*?<\/a>/gi;
    let m;
    while ((m = liRe.exec(listHtml))) {
      eps.push({ href: m[1].trim(), number: m[2] });
    }
  }

  // 3) Fallback: any “/videos/...-episode-#/” links site‑wide
  if (!eps.length) {
    const linkRe = /<a\s+href="([^"]+\/videos\/[^"]+-episode-(\d+)\/)"/gi;
    let m2;
    while ((m2 = linkRe.exec(html))) {
      eps.push({ href: m2[1], number: m2[2] });
    }
  }

  // 4) Dedupe by href
  return [...new Map(eps.map(e => [e.href, e])).values()];
}




// 4) extractStreamUrl(html) — returns the iframe’s src
function extractStreamUrl(html) {
  const src = (html.match(/<iframe[^>]+src="([^"]+)"/) || [,''])[1];
  return src.replace(/&amp;/g, '&');  // unescape HTML entities
}
