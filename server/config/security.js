/* global BrowserPolicy */
BrowserPolicy.content.allowOriginForAll('*.googleapis.com');
BrowserPolicy.content.allowOriginForAll('*.googleusercontent.com');
BrowserPolicy.content.allowOriginForAll('*.gstatic.com');
BrowserPolicy.content.allowOriginForAll('*.bootstrapcdn.com');
BrowserPolicy.content.allowOriginForAll('*.gravatar.com');
BrowserPolicy.content.allowOriginForAll('*.cloudflare.com');
BrowserPolicy.content.allowOriginForAll('*.twimg.com');
BrowserPolicy.content.allowOriginForAll('*.comunes.org');
BrowserPolicy.content.allowOriginForAll('fry.comunes.org:8080');
BrowserPolicy.content.allowOriginForAll('*.twitter.com');
BrowserPolicy.content.allowOriginForAll('*.facebook.net');
BrowserPolicy.content.allowOriginForAll('*.facebook.com');
BrowserPolicy.content.allowOriginForAll('*.youtube.com');
BrowserPolicy.content.allowOriginForAll('*.png');
BrowserPolicy.content.allowOriginForAll('*.jpg');
BrowserPolicy.content.allowOriginForAll('*.jpeg');

BrowserPolicy.content.allowFontDataUrl();

// Needed by yogiben:autoform-map but a security risk
// https://github.com/yogiben/meteor-autoform-modals/issues/20
BrowserPolicy.content.allowEval();

// https://stackoverflow.com/questions/32600469/meteor-browser-policy-local-camera-not-allowed
BrowserPolicy.content.allowOriginForAll('blob:');
