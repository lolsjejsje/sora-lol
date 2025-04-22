module.exports = {
  searchResults: ($) => $('div.thumbnail').map((i, el) => {
    const a = $(el).find('a');
    return {
      title:  a.find('img').attr('alt').trim(),
      href:   a.attr('href'),
      image:  a.find('img').attr('src')
    };
  }).get(),

  extractDetails: ($) => ({
    description: $('div#description, div.entry-content p').first().text().trim() || '',
    aliases:     null,
    airdate:     $('li:contains("First air date")').text().replace('First air date', '').trim() || null
  }),

  extractEpisodes: ($) => $('ul.episodes-list li a').map((i, el) => ({
    href:   $(el).attr('href'),
    number: $(el).text().trim().match(/\d+/)[0]
  })).get(),

  extractStreamUrl: ($) => $('iframe').attr('src') || ''
};
