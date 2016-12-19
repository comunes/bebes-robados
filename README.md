# Iniciativa de Registro y Búsqueda de Bebes Robados

Software para facilitar el regitro, búsqueda, difusión y denuncia de casos de bebes robados.

[![Build Status](http://ci.comunes.org/buildStatus/icon?job=bebes)](http://ci.comunes.org/job/bebes/)

## Uso

Este software está desarrollado con [meteor](https://www.meteor.com/), así que simplemente, bájate el código y ejecuta:

```bash
meteor npm install
meteor --settings settings.json
```

## Instalación

Te recomendamos usar `meteor up` junto con `docker` (mup).

## Tests

Usamos [CucumberJS](https://github.com/cucumber/cucumber-js) a través de [chimp](https://chimp.readme.io).

```bash
# You should start meteor
meteor
# And later run the tests and watch for changes
cd tests/cucumber
chimp --watch --ddp=http://localhost:3000 # during development to pass only @watch tagged tests
chimp --ddp=http://localhost:3000         # to do all the tests
```

## Settings

Sample of settings to use sentry & raven:

```
    "public": {
        "isProduction": true,
        "ravenClientDSN": "https://XXXXXXXXXXXXXX@example.com/X"
    },
    "private": {
        "ravenServerDSN": "https://XXXXXXXXXXXXX:XXXXXXXXXXXX@example.com/X"
    }
}
```

## Desarrolladores

- [@sergigres](https://twitter.com/sergigres), traducción al catalán (moltes gracies!) y francés (merci!)
- [@vjrj](https://github.com/vjrj)


## Licencia

[AGPLv3](https://www.gnu.org/licenses/agpl-3.0.html)
