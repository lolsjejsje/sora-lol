module.exports = {
  // 1) Search Results — target the .search-page > .result-item wrappers
  searchResults: ($) =>
    $('div.search-page div.result-item').map((i, el) => {
      const $item = $(el);
      const title = $item
        .find('div.details .title a')
        .first()
        .text()
        .trim();
      const href  = $item
        .find('div.details .title a')
        .attr('href');
      const image = $item
        .find('div.thumbnail.animation-2 img')
        .attr('src');
      return { title, href, image };
    }).get(),

  // 2) Details extraction (series page)
  extractDetails: ($) => ({
    description: $('div.contenido p').first().text().trim() || '',
    aliases:     null,
    airdate:     $('div.meta span.year').first().text().trim() || null
  }),

  // 3) Episodes extraction (if the page lists them)
  extractEpisodes: ($) =>
    $('ul.episodes-list li a').map((i, el) => ({
      href:   $(el).attr('href'),
      number: $(el).text().trim().match(/\d+/)[0]
    })).get(),

  // 4) Stream URL (embedded iframe)
  extractStreamUrl: ($) => $('iframe').attr('src') || ''
};
