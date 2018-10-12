/* global CookieConsent TAPi18n */

var options = {
  cookieTitle: TAPi18n.__('Uso de Cookies'),
  cookieMessage: TAPi18n.__('Utilizamos cookies para asegurar un mejor uso de nuestra web Si continúas navegando, consideramos que aceptas su uso'),
  // cookieMessageImply: 'Al continuar usando nuestra web sin cambiar la configuración, estas aceptando que usemos estas cookies.',
  showLink: false,
  position: 'top',
  linkText: 'Lee más',
  linkRouteName: '/',
  acceptButtonText: 'Aceptar',
  html: false,
  expirationInDays: 70
};

CookieConsent.init(options);

