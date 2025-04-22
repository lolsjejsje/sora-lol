module.exports = {
  // Search Results
  searchResults: ($) => $('.result-item').map((i, el) => {
    const $el = $(el);
    const link = $el.find('div.image a');
    return {
      title: $el.find('div.details .title a').text().trim() ||
             link.find('img').attr('alt').trim(),
      href:  link.attr('href'),
      image: link.find('img').attr('src')
    };
  }).get(),

  // Details
  extractDetails: ($) => ({
    description: $('div.contenido p').first().text().trim() || '',
    aliases:     null,
    airdate:     $('div.meta span.year').first().text().trim() || null
  }),

  // Episodes
  extractEpisodes: ($) => $('ul.episodes-list li a').map((i, el) => ({
    href:   $(el).attr('href'),
    number: $(el).text().trim().match(/\d+/)[0]
  })).get(),

  // Stream URL
  extractStreamUrl: ($) => $('iframe').attr('src') || ''
};
