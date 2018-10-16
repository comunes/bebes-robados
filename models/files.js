/* global FilesCollection Meteor _ aFilesCollection:true personPhotos:true personAttachs:true Roles Photos:true Attachs:true */

// var createThumb;
// = function (fileObj, readStream, writeStream) {
 // // Transform the image into a 200x200px thumbnail
 //  // TODO check gm.isAvailable
 //  gm(readStream, fileObj.name()).resize('200', '200')
 //    .stream().pipe(writeStream);
// };


// https://github.com/VeliovGroup/Meteor-Files/issues/99
var storagePathConfig = function () {
  return Meteor.settings.public.isProduction ? '/opt/docker/uploads/' : '/opt/docker/uploads-dev';
};

var checkLimitAndExt = function (validExt, validSize, megaLimit) {
  if (validSize && validExt) {
    return true;
  } else {
    if (!validSize) {
      return 'Tipo de fichero no permitido';
    } else {
      return 'Por favor, sube ficheros con un tamaño máximo de ' + megaLimit + 'MB';
    }
  }
};

var onlyOwnerAndAdminsAllowed = function () {
  if (this.userId) {
    if (this.file.meta.owner === this.userId || Roles.userIsInRole(this.userId, ['admin'])) {
      // Allow upload only if
      // current user is signed-in
      // and has role is `admin` or is the owner
      return true;
    }
  }
  return false;
};

var defThrottle = Meteor.isDevelopment ? 1024 * 512 : false; // For downloads

var defCacheControl = 'public, max-age=31536000'; // 1 año

// New file storage (for mup) example:
// https://github.com/VeliovGroup/Meteor-Files/wiki/MeteorUp-(MUP)-Usage
Photos = new FilesCollection({
  collectionName: 'Photos',
  downloadRoute: '/ficheros/fotos',
  allowClientCode: false, // Disallow remove files from Client
  storagePath: storagePathConfig,
  throttle: defThrottle,
  cacheControl: defCacheControl,
  onBeforeUpload: function (file) {
    var megaLimit = 10;
    var validExt = Meteor.isServer ? true : /png|jpg|jpeg/i.test(file.ext);
    var validSize = file.size <= (megaLimit * 1024 * 1024);
    // console.log('File ext: ' + file.ext);
    // console.log('File valid ext: ' + validExt);
    // console.log('File valid size: ' + validSize);
    return checkLimitAndExt(validExt, validSize, megaLimit);
  },
  onAfterUpload: function (fileRef) {
    if (Meteor.isServer) {
      var asyncCall = function(callback) {
        // https://www.npmjs.com/package/imagemagick
        import imagemagick from 'imagemagick';
        var dest = fileRef.path + '-small.png';
        imagemagick.convert(
          [fileRef.path, '-resize', '200x200', dest],
          function (err, stdout) {
            if (err) {
              console.log(err);
              console.log(stdout);
              callback(err);
            }
            callback(null, dest);
          }
        );
      };
      var syncfunction = Meteor.wrapAsync(asyncCall);
      var result = syncfunction();
      if (typeof result === 'string') {
        upd = {
          $set: {}
        };
        upd['$set']['versions.' + 'thumb'] = {
          path: result,
          type: 'image/png',
          extension: 'png'
        };
        Photos.update(fileRef._id, upd, function (error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  },
  onBeforeRemove: onlyOwnerAndAdminsAllowed()
});

Attachs = new FilesCollection({
  collectionName: 'Attachs',
  downloadRoute: '/ficheros/attachs',
  allowClientCode: false, // Disallow remove files from Client
  storagePath: storagePathConfig,
  cacheControl: defCacheControl,
  throttle: defThrottle,
  onBeforeUpload: function (file) {
    var megaLimit = 20;
    var validExt = Meteor.isServer ? true : /png|jpg|jpeg|pdf|doc|odf|xls/i.test(file.ext);
    var validSize = file.size <= (megaLimit * 1024 * 1024);
    return checkLimitAndExt(validExt, validSize, megaLimit);
  },
  onBeforeRemove: onlyOwnerAndAdminsAllowed(),
  // If true - files will be served only to authorized users,
  protected: function (fileObj) {
    // Check if user is own this file
    if (fileObj.meta.owner === this.userId || Roles.userIsInRole(this.userId, ['admin'])) {
      return true;
    } else {
      return false;
    }
  }
});

aFilesCollection = {
  'Attachs': Attachs,
  'Photos': Photos
};

// https://github.com/VeliovGroup/Meteor-Files/wiki/Constructor#attach-schema-isomorphic
/* Photos.collection.attachSchema(new SimpleSchema(Photos.schema));
Attachs.collection.attachSchema(new SimpleSchema(Attachs.schema)); */

if (Meteor.isServer) {
  Photos.allow({
    // TODO: more perms here
    insert: function (userId, doc) {
      return true;
    },
    update: function (userId, doc, fields, modifier) {
      return true;
    },
    remove: function (userId, doc) {
      if (Roles.userIsInRole(userId, ['admin']) || doc.owner === userId) {
        return true;
      }
      return false;
    }
  });
  Photos.allowClient();

  Attachs.allow({
    // TODO: more perms here
    insert: function (userId, doc) {
      return true;
    },
    update: function (userId, doc, fields, modifier) {
      return true;
    },
    remove: function (userId, doc) {
      if (Roles.userIsInRole(userId, ['admin']) || doc.owner === userId) {
        return true;
      }
      return false;
    }
  });
  Attachs.allowClient();
}

personPhotos = function (person) {
  var photos;
  if (person) {
    photos = person.photos;
  }
  if (_.isArray(photos) && photos.length > 0) {
    return Photos.collection.find({ _id: { $in: photos } });
  } else {
    // empty cursor
    return Photos.collection.find({ limit: 0 });
  }
};

// https://github.com/VeliovGroup/Meteor-Files/wiki/collection

personAttachs = function (person, userId) {
  var attachs = person.attachs;
  var isAdmin = Roles.userIsInRole(userId, ['admin']);
  if (isAdmin || person.familiar === userId) {
    if (_.isArray(attachs) && attachs.length > 0) {
      return Attachs.collection.find({ _id: { $in: attachs } });
    }
  }
  // empty cursor
  return Attachs.collection.find({ limit: 0 });
};

if (Meteor.isClient) {
  Meteor.subscribe('files.photos.all');
  Meteor.subscribe('files.attachs.all');
}

if (Meteor.isServer) {
  Meteor.publish('files.photos.all', function () {
    return Photos.find().cursor;
  });
  Meteor.publish('files.attachs.all', function () {
    return Attachs.find().cursor;
  });
}
