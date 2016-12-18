/* global Schema, SimpleSchema, Meteor, $, defaultCreatedAt, Roles
   defaultUpdateAt, addApiRoute nifValido TAPi18n */
// https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript

/*
var phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
 */

SimpleSchema.messages({dniInvalido: 'DNI invalido'});

Schema.UserProfile = new SimpleSchema({
  name: { type: String, optional: true, i18nLabel: 'Nombre completo',
          autoform: {afFieldInput:
                     {placeholder: TAPi18n.__('Nombre y apellidos')}}},
  lang: { type: String, optional: true },
  dni: { type: String, optional: false, i18nLabel: 'DNI (número y letra)',

         regEx: /^\d{8}[A-Z]$/,
         autoform: {
           mask: '99999999A',
           afFieldInput: {placeholder: function() { TAPi18n.__('DNI tipo 99999999A');}}
         },
         custom: function () {
           if (Meteor.isClient && this.isSet) {
             if (!nifValido(this.value)) {
               // Meteor.users.simpleSchema().namedContext('editUserForm').addInvalidKeys([{name: 'dni', type: 'dniInvalido'}]);
               return 'dniInvalido';
             }
           }
         }
       },
  // parentesco: { type: String, optional: true, label:
  // 'Parentesco con el presunto niño/a robado:' },
  telefono: { type: String, optional: true, i18nLabel: 'Teléfono de contacto',
              autoform: {afFieldInput:
                         {placeholder: function() { TAPi18n.__('Teléfono móvil preferiblemente');}}}
  },
  fax: {type: String, optional: true, i18nLabel: 'Fax'}, // regEx: phoneRegex},
  redesSociales: {
    type: [Object],
    i18nLabel: 'Perfiles en redes sociales (twitter, flickr, facebook, etc)' + ' '
      + 'Pueden ayudar en la búsqueda de familiares',
    optional: true
  },
  'redesSociales.$.url': {
    type: String,
    autoform: { afFieldInput: {label: false,
                               type: 'url',
                               placeholder: function() { return TAPi18n.__('pej twitter');}}},
    regEx: SimpleSchema.RegEx.Url
  },
  // imagenes: {
  //   type: [String],
  //   label: 'Fotos mías y de familiares', optional: true
  // },
  // 'imagenes.$': {
  //   autoform: {
  //     afFieldInput: {
  //       onAfterInsert: onAfterUp,
  //       type: 'fileUpload',
  //       accept: 'image/*',
  //       label: 'Elige una foto',
  //       'remove-label': 'Borrar',
  //       // selectFileBtnTemplate: 'selectImageBtn',
  //       previewTemplate: 'imagePreview',
  //       collection: 'Images'
  //     }}},
  createdAt: defaultCreatedAt,
  updatedAt: defaultUpdateAt
});

Schema.User = new SimpleSchema({
  username: {
    type: String,
    i18nLabel: 'Usuario/a',
    regEx: /^[a-z0-9A-Z_]{3,15}$/,
    // For accounts-password, either emails or username is required,
      // but not both.
      // It is OK to make this optional here because the accounts-password
      // package
      // does its own validation.
      // Third-party login packages may not require either.
      // Adjust this schema as necessary for your usage.
    autoform: { readonly: true, disabled: true },
    optional: true
  },
  emails: {
    type: Array,
    min: 1,
    label: function() { return TAPi18n.__('Lista de emails de contacto'); },
    // For accounts-password, either emails or username is required,
      // but not both.
      // It is OK to make this optional here because the accounts-password
      // package
      // does its own validation.
      // Third-party login packages may not require either.
      // Adjust this schema as necessary for your usage.
    optional: true
  },
  'emails.$': {
    label: false,
    type: Object
  },
  'emails.$.address': {
    type: String,
    label: '',
    autoform: { afFieldInput:
                  {label: false, placeholder: TAPi18n.__('pej fulano@gmailcom')} },
    regEx: SimpleSchema.RegEx.Email
  },
  'emails.$.verified': {
    type: Boolean,
    optional: true // if not present === notVerified
  },
  profile: {
    type: Schema.UserProfile,
    i18nLabel: 'Otros datos',
    optional: true
  },
    // Make sure this services field is in your schema
    // if you're using any of the accounts packages
  services: {
    type: Object,
    optional: true,
    autoform: { type: 'hidden' },
    blackbox: true
  },
  // Add `roles` to your schema if you use the meteor-roles package.
  // Option 1: Object type
  // If you specify that type as Object, you must also specify the
  // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
  // Example:
  // Roles.addUsersToRoles(userId, ['admin'], Roles.GLOBAL_GROUP);
  // You can't mix and match adding with and without a group since
  // you will fail validation in some cases.
  // roles: {
  //  type: Object,
  //  optional: true,
  //  autoform: { type: 'hidden' },
  //  blackbox: true
  // }
  // Option 2: [String] type
  // If you are sure you will never need to use role groups, then
  // you can specify [String] as the type
  roles: {
    type: [String],
    autoform: { type: 'hidden' },
    optional: true
  },
  // https://github.com/todda00/meteor-friendly-slugs/issues/1
  friendlySlugs: {
    type: Object,
    optional: true,
    blackbox: true
  },
  slug: {
    type: String,
    optional: true
  }
});

Meteor.users.attachSchema(Schema.User);

Meteor.users.allow({
  update: function (userId, user) {
    if (user._id !== userId) {
      return false;
    } else {
      return true;
    }
  },
  remove: function (userId, user) {
    return Roles.userIsInRole(userId, ['admin']);
  }
});

/*
Tracker.autorun(function () {
  Meteor.subscribe('allUserData')
}); */

var onlyFields = { fields: {
  username: 1,
  'profile.name': 1,
  'profile.redesSociales': 1
}};

addApiRoute('/person/:_id', Meteor.users, onlyFields, '_id');
addApiRoute('/persons', Meteor.users, onlyFields);
addApiRoute('/person/u/:username', Meteor.users, onlyFields, 'username');
