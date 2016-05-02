// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

Template.basicLayout.onRendered(function() {
    // http://stackoverflow.com/questions/21203111/bootstrap-3-collapsed-menu-doesnt-close-on-click
    $(document).on('click','.navbar-collapse.in',function(e) {
	if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
            $(this).collapse('hide');
	}
    });
});

Template.basicLayout.helpers({
  template: function () {
    route = Router.current();
    return route? route.lookupTemplate() : 'home';
  },
  photos: function () {
    var ph = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99]);
    ph[100] = 100;
    return ph;
  }
});

Template.basicLayout.events({
  'load #lorem-photo-100': function () {
    $("#lorem-photos").show();
  }
});

// https://stackoverflow.com/questions/14036248/meteor-setting-the-document-title
Session.setDefault("DocumentTitle", "");
Deps.autorun(function () {
  var newTitle = Session.get('DocumentTitle') + ' - ' + Meteor.App.NAME;
  document.title = newTitle;
  SEO.set({ title: newTitle });
});
