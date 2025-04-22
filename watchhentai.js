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
  const listHtml = (html.match(/<ul class="episodios">([\s\S]*?)<\/ul>/) || [,''])[1];
  const lis      = listHtml.match(/<li[\s\S]*?<\/li>/g) || [];
  return lis.map(li => {
    const m = li.match(/<a href="([^"]+)"[^>]*>(?:Episode\s*)?(\d+)<\/a>/i);
    return m && { href: m[1].trim(), number: m[2] };
  }).filter(x => x);
}

// 4) extractStreamUrl(html) — returns the iframe’s src
function extractStreamUrl(html) {
  const src = (html.match(/<iframe[^>]+src="([^"]+)"/) || [,''])[1];
  return src.replace(/&amp;/g, '&');  // unescape HTML entities
}
