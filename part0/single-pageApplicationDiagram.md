```
sequenceDiagram
    participant browser
    participant server

    Note right of browser: El usuario rellena el formulario y envía la nota

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note (datos de la nueva nota)
    activate server
    server-->>browser: Confirmación de que la nota fue guardada
    deactivate server

    Note right of browser: El navegador actualiza la vista con la nueva nota sin recargar la página

    Note right of browser: El navegador ejecuta el código JavaScript para obtener las notas

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ...]
    deactivate server

    Note right of browser: El navegador ejecuta la función de callback que renderiza las notas
```

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: El usuario rellena el formulario y envía la nota

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note (datos de la nueva nota)
    activate server
    server-->>browser: Confirmación de que la nota fue guardada
    deactivate server

    Note right of browser: El navegador actualiza la vista con la nueva nota sin recargar la página

    Note right of browser: El navegador ejecuta el código JavaScript para obtener las notas

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ...]
    deactivate server

    Note right of browser: El navegador ejecuta la función de callback que renderiza las notas
```