/*global module, expect, client appName */
module.exports = function () {
  var bebes;

  var helper = require('../_support/test-helper.js');
  var appName = helper.appName;

  var alta = function (callback, shouldFail) {
    // TODO login
    if (bebes.lenght <= 0) {
      callback(new Error('This is a data failure'));
    }
    //this.BebesHelper.sessionSet("minBornYear", 1939);
    //this.BebesHelper.sessionSet("maxBornYear", 1940);

    for (var i = 0; i < bebes.length; i++){
      client.url(process.env.ROOT_URL + '/nuevoBebe');
      /* client.waitForVisible('#navbar > ul > li:nth-child(1) > a');
      client.click('#navbar > ul > li:nth-child(1) > a');
      client.waitForVisible('#navbar > ul > li:nth-child(2) > a');
       client.click('#navbar > ul > li:nth-child(2) > a'); */

      var provinciaNacimiento = bebes[i][3];
      var municipioNacimiento = bebes[i][4];

      client.waitForExist('#nombreCompleto', 10000);
      expect(client.getTitle()).toBe("Añade un bebe - " + appName);

      // Wait till loading is not visible
      client.waitForVisible(".pg-loading-center-middle", 10000, true);

      client.waitForVisible("input[name=buscasBebe][value=false]");

      if (bebes[i][2] === "F") {
        client.click("input[name=buscasBebe][value=false]");
      } else {
        client.click("input[name=buscasBebe][value=true]");
      }

      client.setValue('input[name="nombreCompleto"]', bebes[i][0]);

      if (bebes[i][1] !== undefined) {
        client.click('#sexo option[value="' + bebes[i][1] + '"]');
      }

      // client.click('input[name="fechaNacimiento"]');

      // Not working

      // client.keys("11");
      // client.click('input[name="fechaNacimiento"]');
      // client.keys("\uE012\uE012\uE012\uE012\uE012");
      // client.keys("\uE015");
      // client.keys(['\uE012', '\uE012','\uE012', '\uE012']);
      // client.keys("\ue017\ue017\ue017\ue017\ue017\ue017\ue017\ue017");
      // client.keys(bebes[i][8]);

      client.setValue('input[name="lugarNacimiento"]', bebes[i][5]);
      client.selectByVisibleText(
        'select[name=lugarNacimientoProvincia]', provinciaNacimiento);
      client.selectByVisibleText(
        'select[name=lugarNacimientoMunicipio]', municipioNacimiento);

      client.setValue('input[name="nombreCompletoMadre"]', bebes[i][6]);
      client.setValue('input[name="nombreCompletoPadreOConyuge"]', bebes[i][7]);

      client.click('#person-form-submit');

      if (shouldFail) {
        // client.waitForVisible('.danger');
        expect(client.getTitle()).toBe("Añade un bebe - " + appName);
      } else {
        client.waitForText('body', 'Campañas de difusión públicas');
        /* client.waitForExist('#personsTable_filter > label > input');
        expect(client.getTitle()).toBe("Busca bebe");
        client.waitForVisible('#personsTable > tbody > tr:nth-child(1) > td:nth-child(9)');
        if (!phantomJs) {
          // this fails in phantomjs not in chrome:
          client.waitForText('#personsTable > tbody > tr:nth-child(1) > td:nth-child(9)', provinciaNacimiento);
          client.waitForText('#personsTable > tbody > tr:nth-child(1) > td:nth-child(10)', municipioNacimiento);
        } */
      }
    }
  };

  // https://github.com/cucumber/cucumber-js/blob/b659dc887ee8e94149b2148e83857b6c653aa2fa/features/data_tables.feature
  // http://grokbase.com/t/gg/cukes/12av4y61em/cucumber-js-passing-arrays
  this.Given(/^una lista de bebes que se buscan$/, function (tabla, callback) {
    bebes = tabla.raw();
    callback();
  });

  this.Given(
    /^se debe de poder dar de alta correctamente$/, function (callback) {
      alta(callback, false);
      this.AuthenticationHelper.logout();
      callback();
    });

  this.Given(
    /^no se debe de poder dar de alta$/, function (callback) {
      alta(callback, true);
      this.AuthenticationHelper.logout();
      callback();
    });
};
