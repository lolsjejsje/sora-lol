module.exports = {
  // Search Results: target the .result-item containers
  searchResults: ($) => $('div.result-item article').map((i, el) => {
    const a = $(el).find('div.thumbnail.animation-2 a');
    return {
      title: a.find('img').attr('alt').trim(),
      href:  a.attr('href'),
      image: a.find('img').attr('src')
    };
  }).get(),

  // Details extraction (series detail page)
  extractDetails: ($) => ({
    description: $('div.contenido p').first().text().trim() || '',
    aliases:     null,
    airdate:     $('div.meta span.year').first().text().trim() || null
  }),

  // Episodes extraction (if series lists episodes)
  extractEpisodes: ($) => $('ul.episodes-list li a').map((i, el) => ({
    href:   $(el).attr('href'),
    number: $(el).text().trim().match(/\\d+/)[0]
  })).get(),

  // Stream URL (embedded iframe)
  extractStreamUrl: ($) => $('iframe').attr('src') || ''
};
