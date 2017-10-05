/*global module, require */
(function () {

  // 'use strict'; // this hangs ecmascript https://forums.meteor.com/t/meteor-stuck-in-processing-files-with-ecmascript-for/25227/3

  module.exports = function () {

    this.Before(function () {
      // This is not needed anymore
      // https://chimp.readme.io/docs/jasmine-expetc
      // "We have extracted the assertion library from Jasmine and included it as the default in Chimp"
      // global.expect = require('xolvio-jasmine-expect').expect;
    });
  };
})();
