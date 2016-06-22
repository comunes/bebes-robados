/* global SubsManager, undef, Roles, Meteor, Persons, Router, SubsManager, SEO, webPages */

// https://iron-meteor.github.io/iron-router/

var subsManager = new SubsManager();

var subWebPage = function () {
  return subsManager.subscribe('webPages', this.route.options.title);
};

var dataWebPage = function () {
  return webPages.findOne({'title': this.route.options.title});
};

Router.route('/', {
  name: 'home',
  // title: '',
  action: function () {
    this.render('home');
  }, subscriptions: function () {
    return subsManager.subscribe('Persons');
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
    title: 'Busca bebe o familia',
    waitOn: function () {
      return subsManager.subscribe('Persons');
    }
  });
  this.route('difusion', {
    path: '/difusion',
    title: 'Campañas de Difusión',
    waitOn: function () {
      return subsManager.subscribe('AdCampaigns');
    }
  });
  this.route('nuevoBebe', {
    path: '/nuevoBebe',
    title: 'Añade un bebe'
  });
  this.route('abuseAdd', {
    path: '/reportar/:username',
    title: 'Informar de abuso',
    waitOn: function () {
      return subsManager.subscribe('userAndImages', this.params.username);
    },
    data: function () {
      return Meteor.users.findOne({ username: this.params.username });
    }
  });
  this.route('underConstruction', {
    path: '/en-construccion',
    title: 'En construcción'
  });
  this.route('userUpdate', {
    path: '/yo',
    title: 'Mis datos',
    waitOn: function () {
      return subsManager.subscribe('meAndMyImages');
    }
  });

  // TODO : quitar los ifs!!!!!
  this.route('viewUser', {
    path: '/persona/:_id',
    // title: 'Datos de familiar',
    waitOn: function () {
      return subsManager.subscribe('userAndImages', this.params._id);
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
    title: 'Quienes somos',
    waitOn: subWebPage, data: dataWebPage
  });

  this.route('legal', {
    path: '/legal',
    title: 'Información Legal',
    waitOn: subWebPage, data: dataWebPage
  });

  this.route('donaciones', {
    path: '/donaciones',
    title: 'Donaciones',
    waitOn: subWebPage, data: dataWebPage
  });

  this.route('proteccion', {
    path: '/proteccion-datos',
    title: 'Protección de Datos',
    waitOn: subWebPage, data: dataWebPage
  });

  this.route('contacto', {
    path: '/contacto',
    title: 'Contacto',
    waitOn: subWebPage, data: dataWebPage
  });

  this.route('otras', {
    path: '/otras-iniciativas',
    title: 'Otras Iniciativas',
    waitOn: subWebPage, data: dataWebPage
  });

  this.route('denuncia', {
    path: '/denuncia',
    title: 'Denuncia vuestro caso',
    waitOn: subWebPage, data: dataWebPage
  });

  this.route('bebePage', {
    path: '/edita-bebe-id/:_id',
    title: 'Edita bebe',
    waitOn: function () {
      return subsManager.subscribe('personAndImages', this.params._id);
    },
    data: function () {
      return Persons.findOne(this.params._id);
    }
  });
  this.route('editPersonSlug', {
    path: '/edita-bebe/:slug',
    title: 'Edita bebe',
    waitOn: function () {
      return subsManager.subscribe('personAndImagesViaSlug', this.params.slug);
    },
    data: function () {
      return Persons.findOne({slug: this.params.slug});
    }
  });
  this.route('viewPerson', {
    path: '/bebe-id/:_id',
    waitOn: function () {
      return subsManager.subscribe('personAndImages', this.params._id);
    },
    // title: 'Datos sobre bebe',
    data: function () {
      return Persons.findOne(this.params._id);
    }
  });
  this.route('viewPersonSlug', {
    path: '/bebe/:slug',
    // title: 'Datos sobre bebe',
    waitOn: function () {
      return subsManager.subscribe('personAndImagesViaSlug', this.params.slug);
    },
    data: function () {
      return Persons.findOne({slug: this.params.slug});
    }
  });

  this.route('admin', {
    path: '/admin',
    title: 'Administración',
    // template: 'accountsAdmin',
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
        subsManager.subscribe('AdCampaigns'),
        subsManager.subscribe('abuseReports'),
        subsManager.subscribe('Persons')
      ];
    }
  });
  this.route('DifuAdmin', {
    path: '/difu-admin/',
    waitOn: function () {
      return subsManager.subscribe('AdCampaigns');
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
  if (typeof document !== 'undefined') {
    var newTitle;
    if (this.route.options.title) {
      newTitle = this.route.options.title + ' - ' + Meteor.App.NAME;
    } else {
      newTitle = Meteor.App.NAME;
    }
    document.title = newTitle;
    SEO.set({ title: newTitle });
  }
});
