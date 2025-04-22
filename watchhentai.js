// 1) searchResults(html) — returns [{ title, image, href }]
function searchResults(html) {
  const results = [];
  const itemRe = /<div class="result-item">[\s\S]*?<\/article>/g;
  let block;
  while (block = itemRe.exec(html)) {
    const item = block[0];
    const hrefM  = item.match(/<div class="thumbnail[\s\S]*?<a href="([^"]+)"/);
    const titleM = item.match(/<div class="title">[\s\S]*?<a[^>]*>([^<]+)<\/a>/);
    const imgM   = item.match(/<img[^>]+src="([^"]+)"/);
    if (hrefM && titleM) {
      results.push({
        title: titleM[1].trim(),
        image: imgM   ? imgM[1].trim() : "",
        href:  hrefM[1].trim()
      });
    }
  }
  return results;
}

// 2) extractDetails(html) — returns { description, aliases, airdate }
function extractDetails(html) {
  const descM = html.match(/<div class="contenido">[\s\S]*?<p>([\s\S]*?)<\/p>/);
  const yearM = html.match(/<div class="meta">[\s\S]*?<span class="year">([^<]+)<\/span>/);
  return {
    description: descM ? descM[1].trim() : "",
    aliases:     null,
    airdate:     yearM ? yearM[1].trim() : ""
  };
}

// 3) extractEpisodes(html) — returns [{ href, number }]
function extractEpisodes(html) {
  const eps = [];
  // grab <ul class="episodios">…</ul>
  const ulM = html.match(/<ul[^>]*class="[^"]*episodios[^"]*"[^>]*>([\s\S]*?)<\/ul>/i);
  if (ulM) {
    const listHtml = ulM[1];
    const liRe = /<a[^>]+href="([^"]+\/videos\/[^"]+episode-(\d+)\/)"[^>]*>[\s\S]*?Episode\s*(\d+)[\s\S]*?<\/a>/gi;
    let m;
    while (m = liRe.exec(listHtml)) {
      eps.push({ href: m[1].trim(), number: m[2] });
    }
  }
  // fallback scan anywhere
  if (!eps.length) {
    const linkRe = /<a\s+href="([^"]+\/videos\/[^"]+episode-(\d+)\/)"/gi;
    let m2;
    while (m2 = linkRe.exec(html)) {
      eps.push({ href: m2[1], number: m2[2] });
    }
  }
  // dedupe
  return [...new Map(eps.map(e => [e.href, e])).values()];
}

// 4) extractStreamUrl(html) — returns the iframe’s src
function extractStreamUrl(html) {
  const fm = html.match(/<iframe[^>]+src="([^"]+)"/);
  if (!fm) return "";
  return fm[1].replace(/&amp;/g, "&");
}
