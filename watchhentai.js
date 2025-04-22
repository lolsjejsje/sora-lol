module.exports = {
  searchResults: ($) => {
    return $('a:has(img)').map((i, el) => ({
      title:  $(el).find('img').attr('title').trim(),
      href:   $(el).attr('href'),
      image:  $(el).find('img').attr('src')
    })).get();
  },

  extractDetails: ($) => ({
    description: $('div#description').text().trim(),
    aliases:     null,  // watchhentai doesn’t provide aliases
    airdate:     null   // or you can scrape a “Year:” field if present
  }),

  extractEpisodes: ($) => {
    return $('ul.episodes li').map((i, el) => ({
      href:  $(el).find('a').attr('href'),
      number: $(el).find('a').text().trim().match(/\d+/)[0]
    })).get();
  },

  extractStreamUrl: ($) => {
    // most videos are in an <iframe>
    return $('iframe').attr('src');
  }
};
