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

// 3) extractEpisodes(html) — returns [{ href, number }]
function extractEpisodes(html) {
  const eps = [];

  // 1) match the <ul> with class “episodios”, allowing other attributes
  const ulMatch = html.match(/<ul[^>]*class="[^"]*episodios[^"]*"[^>]*>([\s\S]*?)<\/ul>/i);
  if (ulMatch) {
    // grab each <li>…</li> inside that block
    const items = ulMatch[1].match(/<li[\s\S]*?<\/li>/g) || [];
    items.forEach(li => {
      const hrefM   = li.match(/<a\s+href="([^"]+)"/i);
      const numM    = li.match(/>(?:Episode\s*)?(\d+)</i);
      if (hrefM && numM) {
        eps.push({ href: hrefM[1].trim(), number: numM[1] });
      }
    });
  }

  // 2) fallback: scan for any “videos/...-episode-#/” links on the page
  if (!eps.length) {
    let m;
    const linkRe = /<a\s+href="([^"]+videos\/[^"]+episode-(\d+)\/)"/gi;
    while ((m = linkRe.exec(html))) {
      eps.push({ href: m[1], number: m[2] });
    }
  }

  return eps;
}



// 4) extractStreamUrl(html) — returns the iframe’s src
function extractStreamUrl(html) {
  const src = (html.match(/<iframe[^>]+src="([^"]+)"/) || [,''])[1];
  return src.replace(/&amp;/g, '&');  // unescape HTML entities
}
