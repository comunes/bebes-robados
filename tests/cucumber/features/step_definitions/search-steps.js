/*global module expect client require process */
module.exports = function () {

  'use strict';

  var helper = require('../_support/test-helper.js');
  var goHome = helper.goHome;
  var appName = helper.appName;

  var searchs;
  var search;
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
      expect(client.getTitle()).toBe("Busca bebe o familia - " + appName);
      client.waitForText('#personsTable' , 'No se encontraron resultados');
    }
    callback();
  });

  var busca = function (client, i, lugar) {
    search = searchs[i][0];
    client.url(process.env.ROOT_URL + (lugar === 'home' ? '' : '/bebes'));
    var selector = lugar === 'home' ? 'input[id="home-main-search"]': '#personsTable_filter > label > input';
    // var navSelector = '#personsTable_filter > label > input';

    client.waitUntil(function () {
      return client.isVisible('.loading-message') == false;
    }, 5000);
    client.waitForVisible(selector, 10000);
    client.click(selector);
    client.setValue(selector, search);
    // http://webdriver.io/api/protocol/keys.html
    // https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/value
    // Deprecated in the future:
    client.keys("\uE007");

    // https://developer.android.com/reference/android/view/KeyEvent.html#KEYCODE_ENTER
    // client.pressKeyCode(66); ??
  };

  this.Given(/^obtengo una lista de bebes en esos lugares$/, function (callback) {
    for (var i = 0; i < searchs.length; i++){
      busca(client, i);
      client.waitForVisible('#personsTable > tbody > tr:nth-child(1) > td:nth-child(8)');
      expect(client.getTitle()).toBe("Busca bebe o familia - " + appName);
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
