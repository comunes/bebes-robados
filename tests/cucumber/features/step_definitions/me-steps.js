/* global module client expect process  */
module.exports = function () {
  'use strict';

  var helper = require('../_support/test-helper.js');
  var randomUsername = helper.randomUsername;
  var phantomJs = helper.phantonJs;

  var datos;

  this.Given(/^unos datos personales$/, function (table, callback) {
    datos = table.raw();
    callback();
  });

  var clickInSettingsMenuItem = function (client) {
    if (client.isVisible('.bert-content')) {
      // close alert
      client.click('.bert-content');
    }
    client.waitForVisible("li#login-dropdown-list a");
    // Wait till alert is not visible
    client.waitForVisible('.bert-alert', 10000, true);
    client.click("li#login-dropdown-list a");
    client.waitForVisible('#login-buttons-open-change-settings');
    client.click('#login-buttons-open-change-settings');
    client.waitForVisible(".btn-form-submit");
  };

  this.Given(/^actualizo mi perfil correctamente$/, function (callback) {
    clickInSettingsMenuItem(client);
    client.setValue('input[name="profile.name"]', datos[0][0]);
    client.setValue('input[name="profile.dni"]', datos[0][1]);
    client.setValue('input[name="profile.telefono"]', datos[0][2]);

    // Subo imagen

    if (!phantomJs) {
      // TODO
      // client.chooseFile("div.autoform-array-item-body > div > div > div > button > input", datos[0][3]);
      // client.waitForVisible("div.autoform-array-item-body > div > div > div > a > img");
    }

    client.setValue('input[name="profile.redesSociales.0.url"]', datos[0][4]);

    client.click('.btn-form-submit');

    // Home
    client.click('div.navbar-header');

    // Compruebo que está todo salvado
    clickInSettingsMenuItem(client);
    // Veo que la imagen está guardada

    expect(client.getValue('input[name="profile.dni"]')).toBe(datos[0][1]);
    expect(client.getValue('input[name="profile.name"]')).toBe(datos[0][0]);
    expect(client.getValue('input[name="profile.telefono"]')).toBe(datos[0][2]);
    if (!phantomJs) {
      // TODO
      // client.waitForVisible("div.autoform-array-item-body > div > div > div > a > img");
    }
    expect(client.getValue('input[name="profile.redesSociales.0.url"]')).toBe(datos[0][4]);

    // this.AuthenticationHelper.logout();
    callback();
  });

  this.Given(/^si dejo de estar logeado$/, function (callback) {
    this.AuthenticationHelper.logout();
    callback();
  });

  this.Given(/^mi página es visible$/, function (callback) {
    client.url(process.env.ROOT_URL + '/persona/' + randomUsername);
    client.waitForText("body", "Datos de ");
    callback();
  });

};
