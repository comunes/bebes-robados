/* global SubsManager, undef, Roles, Meteor, Persons, Router, SubsManager, Session, webPages, $ TAPi18n */

// https://iron-meteor.github.io/iron-router/

// https://github.com/kadirahq/subs-manager
var subsManager = new SubsManager();

var subWebPage = function () {
  return [
    subsManager.subscribe('settings'),
    subsManager.subscribe('webPages', this.route.options.title)
  ];
};

var dataWebPage = function () {
  return webPages.findOne({'title': this.route.options.title});
};

Router.route('/', {
  name: 'home',
  // Using waitOn you get the loading page at startup
  // subscriptions: function () {
  waitOn: function () {
    return [
      subsManager.subscribe('settings'),
      subsManager.subscribe('PersonsForHome')
    ];
  },
  onStop: function () {
    if (Meteor.isClient) {
      // Enable again scrolls in other routes
      // console.log('fullpage destroy');
      $.fn.fullpage.destroy('all');
    }
  }
});

var requireLogin = function () {
  if (!Meteor.user()) {
    this.render('accessDenied');
    this.stop();
  } else {
    this.next();
  }
};

Router.map(function () {
  this.route('loading', {
    path: '/loading'
  }); // just for testing
  this.route('personsList', {
    path: '/bebes',
    title: TAPi18n.__('Busca bebe o familia'),
    loadingTemplate: 'loading',
    waitOn: function () {
      return [
        subsManager.subscribe('settings'),
        subsManager.subscribe('Persons')
      ];
    }
  });
  this.route('difusion', {
    path: '/difusion',
    title: TAPi18n.__('Campañas de Difusión'),
    // https://github.com/iron-meteor/iron-router/issues/1148
    loadingTemplate: 'loading',
    waitOn: function () {
      return [
        subsManager.subscribe('settings'),
        subsManager.subscribe('AdCampaigns'),
        subsManager.subscribe('personsOfThisUser')];
    }
  });
  this.route('carteles', {
    path: '/carteles',
    layoutTemplate: 'blankLayout',
    loadingTemplate: 'loadingBlank',
    title: TAPi18n.__('Carteles de nuestras Campañas de Difusión'),
    waitOn: function () {
      return [
        subsManager.subscribe('settings'),
        subsManager.subscribe('AdCampaigns')
      ];
    }
  });
  this.route('nuevoBebe', {
    path: '/nuevoBebe',
    title: 'Añade un bebe',
    loadingTemplate: 'loading',
    waitOn: function () {
      // Workaround to wait Meter.user login
      return [
        subsManager.subscribe('settings'),
        subsManager.subscribe('me')
        // subsManager.subscribe('myCampaigns'),
        // subsManager.subscribe('myReports')
      ];
    }
  });
  this.route('abuseAdd', {
    path: '/reportar/:username',
    title: TAPi18n.__('Informar de abuso'),
    loadingTemplate: 'loading',
    waitOn: function () {
      return [
        subsManager.subscribe('settings'),
        subsManager.subscribe('some-user', this.params.username)];
    },
    data: function () {
      return Meteor.users.findOne({ username: this.params.username });
    }
  });
  this.route('underConstruction', {
    path: '/en-construccion',
    title: TAPi18n.__('En construcción')
  });
  this.route('userUpdate', {
    path: '/yo',
    title: TAPi18n.__('Mis datos'),
    loadingTemplate: 'loading',
    waitOn: function () {
      return [
        subsManager.subscribe('settings'),
        subsManager.subscribe('me'),
        subsManager.subscribe('myCampaigns'),
        subsManager.subscribe('myReports')
      ];
    }
  });

  // TODO : quitar los ifs!!!!!
  this.route('viewUser', {
    path: '/persona/:_id',
    // title: 'Datos de familiar',
    loadingTemplate: 'loading',
    waitOn: function () {
      return [
        subsManager.subscribe('settings'),
        subsManager.subscribe('some-user', this.params._id)];
    },
    data: function () {
      var username = Meteor.users.findOne({ username: this.params._id });
      if (undef(username)) {
        var user = Meteor.users.findOne({ _id: this.params._id });
        if (undef(user) || undef(user.username)) {
          return user;
        } else {
          this.redirect('/persona/' + user.username);
        }
      } else {
        return username;
      }
    }
  });

  this.route('quienes', {
    path: '/quienesSomos',
    title: TAPi18n.__('Quienes somos'),
    loadingTemplate: 'loading',
    waitOn: subWebPage, data: dataWebPage
  });

  this.route('legal', {
    path: '/legal',
    title: TAPi18n.__('Información Legal'),
    loadingTemplate: 'loading',
    waitOn: subWebPage, data: dataWebPage
  });

  this.route('donaciones', {
    path: '/donaciones',
    title: TAPi18n.__('Donaciones'),
    loadingTemplate: 'loading',
    waitOn: subWebPage, data: dataWebPage
  });

  this.route('proteccion', {
    path: '/proteccion-datos',
    title: TAPi18n.__('Protección de Datos'),
    loadingTemplate: 'loading',
    waitOn: subWebPage, data: dataWebPage
  });

  this.route('contacto', {
    path: '/contacto',
    title: TAPi18n.__('Contacto'),
    loadingTemplate: 'loading',
    waitOn: subWebPage, data: dataWebPage
  });

  this.route('otras', {
    path: '/otras-iniciativas',
    title: TAPi18n.__('Otras Iniciativas'),
    loadingTemplate: 'loading',
    waitOn: subWebPage, data: dataWebPage
  });

  this.route('denuncia', {
    path: '/denuncia',
    title: TAPi18n.__('Denuncia vuestro caso'),
    loadingTemplate: 'loading',
    waitOn: subWebPage, data: dataWebPage
  });

  this.route('bebePage', {
    path: '/edita-bebe-id/:_id',
    title: TAPi18n.__('Edita bebe'),
    loadingTemplate: 'loading',
    waitOn: function () {
      return [
        subsManager.subscribe('settings'),
        subsManager.subscribe('personAndFiles', this.params._id)];
    },
    data: function () {
      return Persons.findOne(this.params._id);
    }
  });
  this.route('editPersonSlug', {
    path: '/edita-bebe/:slug',
    title: TAPi18n.__('Edita bebe'),
    loadingTemplate: 'loading',
    waitOn: function () {
      return [
        subsManager.subscribe('settings'),
        subsManager.subscribe('personAndFilesViaSlug', this.params.slug)
      ];
    },
    data: function () {
      return Persons.findOne({slug: this.params.slug});
    }
  });
  this.route('viewPerson', {
    path: '/bebe-id/:_id',
    loadingTemplate: 'loading',
    waitOn: function () {
      return [
        subsManager.subscribe('settings'),
        subsManager.subscribe('personAndFiles', this.params._id)
      ];
    },
    data: function () {
      return Persons.findOne(this.params._id);
    }
  });
  this.route('viewPersonSlug', {
    path: '/bebe/:slug',
    loadingTemplate: 'loading',
    waitOn: function () {
      return [
        subsManager.subscribe('settings'),
        subsManager.subscribe('personAndFilesViaSlug', this.params.slug)];
    },
    data: function () {
      return Persons.findOne({slug: this.params.slug});
    }
  });

  this.route('admin', {
    path: '/admin',
    title: TAPi18n.__('Administración'),
    loadingTemplate: 'loading',
    template: 'bebeAdmin',
    onBeforeAction: function () {
      if (Meteor.loggingIn()) {
        this.render(this.loadingTemplate);
      } else
      if (!Roles.userIsInRole(Meteor.user(), ['admin'])) {
        console.log('Not an admin, redirecting');
        this.redirect('/');
      }
      this.next();
    },
    waitOn: function () {
      return [
        subsManager.subscribe('settings'),
        subsManager.subscribe('AdCampaigns'),
        subsManager.subscribe('abuseReports'),
        subsManager.subscribe('Persons')
      ];
    }
  });
  this.route('DifuAdmin', {
    path: '/difu-admin/',
    loadingTemplate: 'loading',
    waitOn: function () {
      return [
        subsManager.subscribe('settings'),
        subsManager.subscribe('AdCampaigns')
      ];
    }
  });
});

// Not used now
/*
var profileUpdated = function () {
  return moment(Meteor.user().profile.updatedAt).
    diff(Meteor.user().profile.createdAt, 'seconds') !== 0;
} */

// Páginas que necesitan login
Router.onBeforeAction(
  requireLogin, {
    except: ['appDumpHTTP'],
    only: [
      'nuevoBebe',
      'abuseAdd',
      'admin',
      'bebePage', // edita bebe
      'editPersonSlug',
      'userUpdate']
  }
);

Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});

// https://iron-meteor.github.io/iron-router/#hooks

Router.onAfterAction(function () {
  if (this.ready()) {
    Meteor.isReadyForSpiderable = true;
  }
});

// http://stackoverflow.com/questions/19882687/set-html-title-when-using-iron-router
Router.after(function () {
  if (Meteor.isClient) {
    Session.set('DocumentTitle', this.route.options.title);
  }
});

var oldRoute = ''; // fix for onRun Problem of ironRouter
Router.onBeforeAction(function () {
  if (Meteor.isClient) {
    var route = Router.current().url;
    if (route !== oldRoute) {
      // console.log(route);
      Meteor.Piwik.trackPage(route);
      oldRoute = route;
    }
  }
  this.next();
});
