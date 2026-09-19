# Frontend - Reto 3

Implementacion Angular del flujo reactivo para gestion de empleados.

## Patron aplicado

- `EmployeeService` concentra el consumo HTTP y el estado de empleados.
- Los `BehaviorSubject` son privados y exponen solo observables publicos (`employees$`, `loading$`, `error$`).
- Las altas, ediciones y eliminaciones actualizan el estado con nuevas referencias inmutables.
- `AppComponent` consume los observables con `async` pipe y no realiza suscripciones manuales.

## Ejecucion

```bash
npm install
npm start
```

La aplicacion espera el backend en `http://localhost:3000/api/v1/employees`.
