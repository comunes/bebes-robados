# language: es

  # cucumber --i18n es

Característica: Alta de bebes correcta

  Antecedentes:
    Dado que me logeo con el usuario de pruebas

  Escenario: Verifico que un bebe que se busca se puede dar de alta con la información básica
    Dado una lista de bebes que se buscan
    | Federico Trino              | Hombre      | B | Cordoba  | Rute      | Hospital | Ana     | Gerardo | 14/7/1943   |
    | Francisco Javier            | Hombre      | F | Murcia   | Cartagena | Hospital | Marta   | Germán  | 22/08/1960  |
    | María Gómez                 | Mujer       | F | Madrid   | Alcorcón  | Hospital | María   | Luis    | 22/Ago/1960 |
    | Feliciano Fernández-Alvarez | Desconocido | B | Asturias | Gijón     | Hospital | Justina | Teodoro | 1/1/1970    |
    |                             | Mujer       | F | Madrid   | Alcorcón  | Hospital | María   | Luis    | 22/Ago/1960 |
    Entonces se debe de poder dar de alta correctamente

  Escenario: Verifico que un bebe que se busca no se puede dar de alta sin la información básica
    Dado una lista de bebes que se buscan
    | Francisco Javier |       |   | Murcia | Cartagena | Hospital | Marta | Germán | 22/08/1960  |
  Entonces no se debe de poder dar de alta
