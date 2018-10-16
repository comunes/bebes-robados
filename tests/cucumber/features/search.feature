# language: es
Característica: Búsqueda de bebes desde el inicio y desde la página de búsqueda
  @ignore
  # No visible pq no están validados/moderados
  Escenario: Verifico que puedo buscar desde el inicio
    Dado que estoy en el inicio
    Y que tecleo ciertas búsquedas
    |Russia|
    |Poland|
    |Brazil|
    Entonces obtengo una lista vacía de bebes
    # Entonces obtengo una lista de bebes en esos lugares

  @watch
  Escenario: Verifico que ciertas búsquedas no dan resultados
    Dado que estoy en el inicio
    Y que tecleo ciertas búsquedas raras
    | añasdladada |
    | asdfad      |
    Entonces obtengo una lista vacía de bebes

  @watch
  # No visible pq no están validados/moderados
  Escenario: Verifico que puedo buscar desde la página de búsqueda
    Dado que estoy en la página de búsquedas
    Y que tecleo ciertas búsquedas
    |Russia|
    |Poland|
    |Brazil|
    Entonces obtengo una lista vacía de bebes
    # Entonces obtengo una lista de bebes en esos lugares
