/*global initYear, lastYear, Session, Template, Tracker, onSliderRender:true, calcShowAll:true, $ */
// Tracker.autorun(function () {
  // console.log('min: ' + Session.get('minBornYear') +
  //             ', max: ' + Session.get('maxBornYear'));
// });

import {initYear, lastYear } from '/imports/lib/functions.js';


Session.setDefault('minBornYear', initYear);
Session.setDefault('maxBornYear', lastYear);

calcShowAll = function () {
  var showAll = Session.get('minBornYear') === initYear &&
  Session.get('maxBornYear') === lastYear;
  // console.log('Show all: ' + showAll);
  return showAll;
};

onSliderRender = function (changeCallback) {
  if (Session.get('minBornYear') < initYear) {
    Session.set('minBornYear', initYear);
  }

  if (Session.get('maxBornYear') > lastYear) {
    Session.set('maxBornYear', lastYear);
  }

  var initSpan = this.$('#initSliderYear');
  var endSpan = this.$('#endSliderYear');

  initSpan.text(Session.get('minBornYear'));
  endSpan.text(Session.get('maxBornYear'));

  var refresh = function (ev, val) {
    var min = Math.round(val[0]);
    var max = Math.round(val[1]);
    Session.set('minBornYear', min);
    Session.set('maxBornYear', max);
    $('#initSliderYear').text(min);
    $('#endSliderYear').text(max);
    changeCallback();
  };

  // http://refreshless.com/nouislider/examples/
  this.$('#yearSlider').noUiSlider({
    start: [Session.get('minBornYear'), Session.get('maxBornYear')],
    connect: true,
    range: {
      min: initYear,
      max: lastYear
    }
  }).on('slide', function (ev, val) {
    refresh(ev, val);
  }).on('change', function (ev, val) {
    refresh(ev, val);
  });
};

Template.yearSlider.onRendered(function () {
});
