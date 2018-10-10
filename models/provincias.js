/* global Schema, SimpleSchema, Mongo, Provincias:true, provinciaFind:true, addApiRoute, Roles  */

import {addApiRoute} from '/imports/lib/api.js';

Schema.Provincias = new SimpleSchema({
  code: { type: Number, optional: false, index: 1 },
  name: { type: String, optional: false }
});

Provincias = new Mongo.Collection('Provincias');

// No usado ahora
provinciaFind = function (prov_id) {
  var prov = Provincias.find({ code: parseInt(prov_id, 10) });
  return prov.count() > 0 ? prov.fetch()[0].name : '';
};

var onlyFields = { fields: {_id: 0, code: 1, name: 1} };
addApiRoute('/provincia/:code', Provincias, onlyFields, 'code');
addApiRoute('/provincias', Provincias, onlyFields);

Provincias.allow({
  insert: function (userId, doc) {
    return false;
  },
  update: function (userId, doc, fields, modifier) {
    return false;
  },
  remove: function (userId, doc) {
    return false;
  }
});
