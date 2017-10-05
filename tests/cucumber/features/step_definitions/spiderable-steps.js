/* global process module client */

module.exports = function () {

  var urls;

  this.Given(/^la página de sitemap\.xml$/, function (callback) {
      client.url(process.env.ROOT_URL + '/sitemap.xml');
      callback();
  });

  this.Given(/^compruebo que existe una lista de páginas en el sitemap$/, function (table, callback) {
    urls = table.raw();
    for (var i = 0; i < urls.length; i++) {
      // FIXME client.waitForText(".text", urls[i][0]);
    }
    callback();
  });

  this.Given(/^que son spiderables$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    for (var i = 0; i < urls.length; i++) {
      client.url(process.env.ROOT_URL + urls[i][0] + "?_escaped_fragment_=");
      client.waitForText("body", urls[i][1]);
    }
    callback();
  });

};
