/*global Meteor,Accounts,console,YAML,Fixtures, webPages Persons Assets Provincias Municipios */

var loadUser = function (user) {
  var userAlreadyExists = typeof Meteor.users.findOne({ username: user.username }) === 'object';

  if (!userAlreadyExists) {
    Accounts.createUser(user);
    console.log('Creating user ' + user.username);
  }
};

var loadFixture = function (fixtures, collection) {
  for (var i = 0; i < fixtures.length; i += 1) {
    // collection.remove({ });
    collection.insert(fixtures[i]);
  }
};

Meteor.startup(function () {
  // Create test users in production also
  var users = YAML.eval(Assets.getText('users.yml'));

  for (var key in users) {
    if (users.hasOwnProperty(key)) {
      loadUser(users[key]);
    }
  }

  // but down asign fixtures to test user
  if (!Meteor.settings.public.isProduction) {
    var testUserId = Meteor.users.findOne({username: 'test'})._id;

    if (testUserId !== null && Persons.find().count() === 0) {
      console.log('Loading persons fixtures for user ' + testUserId);
      loadFixture(Fixtures.persons, Persons);
      Persons.update({}, {$set: {familiar: testUserId}}, { multi: true });
    } else {
      // console.log('Not loading persons fixtures.');
    }
  }
  if (Provincias.find().count() === 0) {
    console.log('Loading provinces fixtures.');
    var p = Fixtures.provincias;
    for (var i = 0; i < p.length; i += 1) {
      Provincias.insert({'code': parseInt(p[i].code, 10), 'name': p[i].name});
    }
  }
  if (Municipios.find().count() === 0) {
    console.log('Loading municipes fixtures.');
    var m = Fixtures.municipios;
    for (var j = 0; j < m.length; j += 1) {
      Municipios.insert({cod_id: parseInt(m[j].id, 10), cod_prov: parseInt(m[j].cod_prov, 10),
                         cod_mun: parseInt(m[j].cod_mun, 10), name: m[j].name });
    }
  }

  /* Estos títulos deben coincidir con la rutas de mainRoutes.js */
  var pages = ['Contacto', 'Quienes somos', 'Información Legal', 'Protección de Datos', 'Donaciones', 'Otras Iniciativas', 'Denuncia vuestro caso'];

  for (var page = 0; page < pages.length; page++) {
    var title = pages[page];
    if (webPages.find({title: title}).count() === 0) {
      webPages.insert({title: title, text: 'Pulsa con el ratón para editar esta página'});
    }
  }
});
