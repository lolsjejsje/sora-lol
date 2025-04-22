// --------- Async JS Mode for WatchHentai ---------

// 1) searchResults(keyword) → [{ title, image, href }]
async function searchResults(keyword) {
  const api = `https://watchhentai.net/wp-json/wp/v2/posts?search=${encodeURIComponent(keyword)}&_embed`;
  const resp = await fetchv2(api);
  const posts = await resp.json();
  return posts.map(p => ({
    title: p.title.rendered,
    image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
    href: p.link
  }));
}

// 2) extractDetails(url) → { description, aliases, airdate }
async function extractDetails(url) {
  // Grab post ID from URL
  const id = url.replace(/\/$/, '').split('/').pop();
  const api = `https://watchhentai.net/wp-json/wp/v2/posts/${id}`;
  const resp = await fetchv2(api);
  const p = await resp.json();
  return {
    description: p.content.rendered.replace(/<[^>]+>/g, '').trim(),
    aliases:     null,
    airdate:     p.date.split('T')[0]
  };
}

// 3) extractEpisodes(url) → [{ href, number }]
async function extractEpisodes(url) {
  // WatchHentai shows series pages via client‑side JS, so we’ll
  // just treat the series page itself as “episode 1”
  return [{ href: url, number: "1" }];
}

// 4) extractStreamUrl(url) → "https://…video.mp4"
async function extractStreamUrl(url) {
  // The site embeds players in an <iframe>, so return that directly.
  // You could fetch the page and regex out a .mp4, but the iframe works.
  return url;
}
