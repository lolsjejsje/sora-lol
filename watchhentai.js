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
