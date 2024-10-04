```
sequenceDiagram

    participant browser
    participant server

    Note right of browser: La aplicación carga todos los recursos desde el caché local

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    server-->>browser: Confirmación de que los datos han sido guardados
    deactivate server

    Note right of browser: Los nuevos datos se integran en la vista sin recargar la página
```

```mermaid
sequenceDiagram

    participant browser
    participant server

    Note right of browser: La aplicación carga todos los recursos desde el caché local

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    server-->>browser: Confirmación de que los datos han sido guardados
    deactivate server

    Note right of browser: Los nuevos datos se integran en la vista sin recargar la página
```