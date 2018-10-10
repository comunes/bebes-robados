/* global Schema, SimpleSchema, Mongo, Municipios:true, municipioFind:true, addApiRoute */

import {addApiRoute} from '/imports/lib/api.js';

Schema.Municipios = new SimpleSchema({
  cod_id: { type: Number, optional: false, index: 1 },
  cod_prov: { type: Number, optional: false, index: 1 },
  cod_mun: { type: Number, optional: false, index: 1 },
  name: { type: String, optional: false }
});

Municipios = new Mongo.Collection('Municipios');

// No usado ahora
municipioFind = function (cod_id) {
  var muns = Municipios.find({cod_id: parseInt(cod_id, 10)});
  return muns.count() > 0 ? muns.fetch()[0].name : '';
};

var onlyFields = { fields: {_id: 0, cod_id: 1, cod_prov: 1, cod_mun: 1, name: 1} };
addApiRoute('/municipio/id/:cod_id', Municipios, onlyFields, 'cod_id');
addApiRoute('/municipio/prov/:cod_prov', Municipios, onlyFields, 'cod_prov', true);
addApiRoute('/municipios', Municipios, onlyFields);

Municipios.allow({
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
