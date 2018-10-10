/*global undef:true,noUndef:true,defaultCreatedAt:true,
 defaultUpdateAt:true,isValidLatLng:true, lastWeek:true, calcShowAll:true,
 lastDays: true, lastDay:true, initYear:true, thisYear:true, lastYear:true, isNew:true
 currentAdCampaign:true nifValido:true */

export const undef = function (obj) {
  return typeof obj === 'undefined' || obj === null;
};

export const noUndef = function (obj) {
  return !undef(obj);
};

export const defaultCreatedAt = {
  type: Date,
  autoform: { type: 'hidden' },
  autoValue: function () {
    if (this.isInsert) {
      return new Date();
    } else {
      this.unset();  // Prevent user from supplying their own value
    }
  }
};

export const defaultUpdateAt = {
  type: Date,
  autoform: { type: 'hidden' },
  autoValue: function () {
    if (this.isUpdate || this.isInsert) {
      return new Date();
    }
  },
  // Commented because we want to have updateAt = createAt initialy
  // denyInsert: true,
  optional: true
};

export const isValidLatLng = function (l) {
  return (typeof l === 'number' && !isNaN(l)) ||
         (typeof l === 'string' && l.length > 0 && !isNaN(l));
};

// export const lastWeek = function () {
//   return lastDays(7);
// };

export const lastDay = function () {
  return lastDays(1);
};

var today = new Date();

export const lastDays = function (days) {
  var lastWeek = new Date(today.getFullYear(),
                          today.getMonth(), today.getDate() - days);
  return lastWeek;
};

export const initYear = 1936;
export const lastYear = 1990;

export const thisYear = new Date().getFullYear();
var calcShowAll = null;

export const isNew = function (updatedAt) {
  return updatedAt > lastDays(7);
};

export const currentAdCampaign = 1;

// From: https://donnierock.com/2011/11/05/validar-un-dni-con-javascript/
export const nifValido = function (dni) {
  var numero;
  var letr;
  var letra;
  var expresion_regular_dni;

  expresion_regular_dni = /^\d{8}[a-zA-Z]$/;

  if (expresion_regular_dni.test(dni) === true) {
    numero = dni.substr(0, dni.length - 1);
    letr = dni.substr(dni.length - 1, 1);
    numero = numero % 23;
    letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
    letra = letra.substring(numero, numero + 1);
    if (letra !== letr.toUpperCase()) {
      console.log('Dni erroneo, la letra del NIF no se corresponde');
      return false;
    } else {
      console.log('Dni correcto');
      return true;
    }
  } else {
    console.log('Dni erroneo, formato no válido');
    return false;
  }
};
