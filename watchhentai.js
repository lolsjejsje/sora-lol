// 1) searchResults(html) — returns [{ title, image, href }]
function searchResults(html) {
  const items = html.match(/<div class="result-item">[\s\S]*?<\/article>/g) || [];
  return items.map(item => {
    const href  = (item.match(/<a\s+href="([^"]+)"/)           || [,''])[1].trim();
    const title = (item.match(/<div class="title">[\s\S]*?<a[^>]*>([^<]+)<\/a>/) || [,''])[1].trim();
    const image = (item.match(/<img[^>]+src="([^"]+)"/)        || [,''])[1].trim();
    return { title, image, href };
  });
}

// 2) extractDetails(html) — returns { description, aliases, airdate }
function extractDetails(html) {
  const description = (html.match(/<div class="contenido">[\s\S]*?<p>([\s\S]*?)<\/p>/) || [,''])[1].trim();
  const airdate     = (html.match(/<div class="meta">[\s\S]*?<span class="year">([^<]+)<\/span>/) || [,''])[1].trim();
  return { description, aliases: null, airdate };
}

// 3) extractEpisodes(html) — returns [{ href, number }]
function extractEpisodes(html) {
  const eps = [];

  // primary: scrape inside <ul class="episodios">…</ul>
  const ulMatch = html.match(/<ul[^>]*class="[^"]*episodios[^"]*"[^>]*>([\s\S]*?)<\/ul>/i);
  if (ulMatch) {
    const listHtml = ulMatch[1];
    const liRe = /<li[\s\S]*?>[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>(?:\s*Episode\s*)?(\d+)[\s\S]*?<\/a>/gi;
    let m;
    while ((m = liRe.exec(listHtml))) {
      eps.push({ href: m[1].trim(), number: m[2] });
    }
  }

  // fallback: any “/videos/...-episode-#/” links elsewhere on the page
  if (!eps.length) {
    const linkRe = /<a\s+href="([^"]+\/videos\/[^"]+-episode-(\d+)\/)"/gi;
    let m2;
    while ((m2 = linkRe.exec(html))) {
      eps.push({ href: m2[1], number: m2[2] });
    }
  }

  // dedupe by href
  return [...new Map(eps.map(e => [e.href, e])).values()];
}

// 4) extractStreamUrl(html) — returns the player iframe URL
function extractStreamUrl(html) {
  const src = (html.match(/<iframe[^>]+src="([^"]+)"/) || [,''])[1];
  return src.replace(/&amp;/g, '&');
}
