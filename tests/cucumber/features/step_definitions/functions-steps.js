/*global module require expect isValidLatLng undef noUndef */

module.exports = function () {
  var vnum;
  var u;
  require("../../../../lib/functions.js");

  this.Given(/^el número ([\-0-9\.]*)$/, function (num) {
    vnum = num;
  });

  this.Given(/^el número "([\-0-9\.]*)"$/, function (num) {
    vnum = num;
  });

  this.Given(/^la cadena "([^"]*)"$/, function (num) {
    vnum = num;
  });

  this.Then(/^debe ser una longitud o latitud válida$/, function () {
    expect(isValidLatLng(vnum)).toBe(true);
  });

  this.Then(/^no debe ser una longitud o latitud válida$/, function () {
    expect(isValidLatLng(vnum)).toBe(false);
  });

  this.Given(/^un objeto no definido$/, function (callback) {
    callback();
  });

  this.Given(/^se debe detectar$/, function (callback) {
    expect(undef(u)).toBe(true);
    callback();
  });

  this.Given(/^un objeto nulo$/, function (callback) {
    u = null;
    callback();
  });

  this.Given(/^un objeto no nulo$/, function (callback) {
    u = "foo";
    callback();
  });

  this.Given(/^se debe detectar como no undefinido$/, function (callback) {
    expect(noUndef(u)).toBe(true);
    callback();
  });
};
