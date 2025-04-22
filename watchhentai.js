module.exports = {
    searchResults: ($) => {
        return $('a:has(img)').map((i, el) => ({
            title: $(el).find('img').attr('title').trim(),
            url: $(el).attr('href'),
            thumbnail: $(el).find('img').attr('src')
        })).get();
    },

    extractDetails: ($) => {
        return {
            title: $('h1').first().text().trim(),
            description: $('div#description').text().trim(),
            genres: $('div.genres a').map((i, el) => $(el).text().trim()).get()
        };
    },

    extractEpisodes: ($) => {
        return $('ul.episodes li').map((i, el) => ({
            episode: $(el).text().trim(),
            url: $(el).find('a').attr('href')
        })).get();
    },

    extractStreamUrl: ($) => {
        return $('iframe').attr('src');
    }
};
