/*global module, expect, client */
module.exports = function () {

  var searchs;
  var lugar;

  this.Given(/^que estoy en el inicio$/, function (callback) {
    goHome(client);
    lugar = 'home';
    callback();
  });

  this.Given(/^que estoy en la página de búsquedas$/, function (callback) {
    lugar = 'bebes';
    callback();
  });

  this.Given(/^que tecleo ciertas búsquedas$/, function (table, callback) {
    searchs = table.raw();
    callback();
  });

  this.Given(/^que tecleo ciertas búsquedas raras$/, function (table, callback) {
    searchs = table.raw();
    callback();
  });

  this.Given(/^obtengo una lista vacía de bebes$/, function (callback) {
    for (var i = 0; i < searchs.length; i++) {
      busca(client, i, lugar);
      client.waitForVisible('#personsTable');
      expect(client.getTitle()).toBe("Busca bebe");
      client.waitForText('#personsTable' , 'No se encontraron resultados');
    }
    callback();
  });

  var busca = function (client, i, lugar) {
    search = searchs[i][0];
    client.url(process.env.ROOT_URL + (lugar === 'home' ? '' : '/bebes'));
    var selector = lugar === 'home' ? 'input[id="home-main-search"]': '#personsTable_filter > label > input';
    client.waitForVisible(selector);
    client.setValue(selector, search);
    // http://webdriver.io/api/protocol/keys.html
    // https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/value
    client.keys("\uE007");
  }

  this.Given(/^obtengo una lista de bebes en esos lugares$/, function (callback) {
    for (var i = 0; i < searchs.length; i++){
      busca(client, i);
      client.waitForVisible('#personsTable > tbody > tr:nth-child(1) > td:nth-child(8)');
      expect(client.getTitle()).toBe("Busca bebe");
      client.waitForText('#personsTable > tbody > tr:nth-child(1) > td:nth-child(8)', search);
      client.waitForVisible('#personsTable > tbody > tr:nth-child(1)');
      client.click('#personsTable > tbody > tr:nth-child(1)');
      client.waitForText("body", "Datos del presunto robo");
      client.waitForVisible("#datosbasicos > a");
      client.click("#datosbasicos > a");
      client.waitForText("body", "Datos de esta persona");
    }
    callback();
  });

}
