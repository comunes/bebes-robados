/* global Roles Meteor Template Session calcShowAll renderProvincias Router $ setEmptyTable onSliderRender Tracker TAPi18n  */
Template.personsList.helpers({
  soloPdtes: function () { return Session.get('soloPdtes') ? 'checked' : ''; },
  selector: function () {
    var enProv = Session.get('buscaEnProvincia');
    var isAdmin = Roles.userIsInRole(Meteor.userId(), ['admin']);
    var soloPdtes = isAdmin && Session.get('soloPdtes');
    var validated = soloPdtes ? [false] : [true, !isAdmin];

    // console.log('En prov: ' + enProv);
    if (!calcShowAll()) {
      if (enProv === '-1') {
        return { 'fechaNacimiento':
                 {$gte: new Date(Session.get('minBornYear'), 0, 1),
                  $lte: new Date(Session.get('maxBornYear'), 11, 31)
                 },
                 'validated': {$in: validated}
               };
      } else {
        return { 'fechaNacimiento':
                 {$gte: new Date(Session.get('minBornYear'), 0, 1),
                  $lte: new Date(Session.get('maxBornYear'), 11, 31)
                 },
                 'lugarNacimientoProvincia': enProv,
                 'validated': {$in: validated}
        };
      }
    } else {
      // Show all
      if (enProv === '-1') {
        return {'validated': {$in: validated}
               };
      } else {
        return { 'lugarNacimientoProvincia': enProv,
                 'validated': {$in: validated}
               };
      }
    }
  }
});

Template.personsList.events({
  'change #soloPdtes': function (event) {
    var checked = event.target.checked;
    Session.set('soloPdtes', checked);
  },
  'click tbody > tr': function (event) {
    var dataTable = $(event.target).closest('table').DataTable();
    var rowData = dataTable.row(event.currentTarget).data();
    // console.log(rowData);
    if (typeof rowData.slug === 'string') {
      Router.go('viewPersonSlug', { slug: rowData.slug });
    } else {
      Router.go('viewPerson', {_id: rowData._id instanceof Object ? rowData._id._str : rowData._id});
    }
  }
});

Template.personsList.onCreated(function () {
  setEmptyTable('');
  /* $('#personsTable_filter > label > input').removeClass('imput-sm');
  $('#personsTable_filter > label > input').addClass('input-lg'); */
});

Template.personsList.onRendered(function () {
  // https://github.com/aldeed/meteor-tabular/issues/53#issuecomment-70870232
  _.each($('thead tr th'), function (o) {
    var title = $(o).html();
    if (title !== '...') {
      $(o).html(TAPi18n.__(title));
    }
  });

  var searchInput = $('#personsTable_filter > label > input');

  var dataTable = $('#personsTable').closest('table').DataTable();
  dataTable.column(0).visible(false);
  dataTable.column(1).visible(false);
  dataTable.column(2).visible(false);
  Tracker.autorun(function () {
    try {
      dataTable.column(3).visible(Roles.userIsInRole(Meteor.userId(), ['admin']));
    } catch (err) {
    }
  });

  onSliderRender(function () {
    dataTable.draw();
  });

  setEmptyTable(TAPi18n.__('Ningún dato disponible'));

  var search = Session.get('main-home-search');
  if (typeof search === 'string' && searchInput.val() !== search) {
    searchInput.val(search);
    // console.log('Search: ' + search);
    // console.log('Search input val: ' + searchInput.val());
    dataTable.search(search);
  }

  // Select all input
  searchInput.focus(function () { $(this).select(); }).mouseup(function (e) { e.preventDefault(); });

  // Put the cursor there
  searchInput.focus();

  searchInput.change(function () { delete Session.keys['main-home-search']; });

  // Render provincias
  Session.setDefault('buscaEnProvincia', '-1');
  Session.setDefault('soloPdtes', false);

  var onProvSelect = function (prov) {
    Session.set('buscaEnProvincia', prov);
    dataTable.draw();
  };

  var onMuniSelect = function () {
  };

  var prevProv = Session.get('buscaEnProvincia');
  var prevMuni = -1;

  renderProvincias(prevProv, prevMuni, onProvSelect, onMuniSelect, TAPi18n.__('-- todas las provincias --'));
  // Fin render provincias
});
