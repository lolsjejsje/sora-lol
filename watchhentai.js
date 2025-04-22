module.exports = {
  // 1) searchResults(html) — must return [{ title, image, href }]
  searchResults: ($) => {
    const results = [];
    $('div.search-page div.result-item').each((i, el) => {
      const $item = $(el);
      const title = $item.find('div.details .title a').text().trim();
      const href  = $item.find('div.details .title a').attr('href');
      const image = $item.find('div.thumbnail.animation-2 img').attr('src');
      if (title && href) {
        results.push({ title, image, href });
      }
    });
    return results;
  },

  // 2) extractDetails(html) — must return { description, aliases, airdate }
  extractDetails: ($) => ({
    description: $('div.contenido p').first().text().trim() || '',
    aliases:     null,
    airdate:     $('div.meta span.year').first().text().trim() || null
  }),

  // 3) extractEpisodes(html) — must return [{ href, number }]
  extractEpisodes: ($) => {
    return $('ul.episodes-list li a').map((i, el) => ({
      href:   $(el).attr('href'),
      number: $(el).text().trim().match(/\d+/)[0]
    })).get();
  },

  // 4) extractStreamUrl(html) — must return a URL string
  extractStreamUrl: ($) => {
    return $('iframe').attr('src') || '';
  }
};
