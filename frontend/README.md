# Frontend - Retos 3 y 4

Implementacion Angular del flujo reactivo para gestion de empleados.

## Patron aplicado

- `EmployeeService` concentra el consumo HTTP y el estado de empleados.
- Los `BehaviorSubject` son privados y exponen solo observables publicos (`employees$`, `loading$`, `error$`).
- Las altas, ediciones y eliminaciones actualizan el estado con nuevas referencias inmutables.
- `AppComponent` consume los observables con `async` pipe y no realiza suscripciones manuales.
- `AppComponent` actua como Smart Component: orquesta el servicio, selecciona empleados y conecta eventos.
- `EmployeeFormComponent` y `EmployeeListComponent` son Dumb Components: reciben datos por `@Input()` y comunican acciones por `@Output()`.
- El formulario clona el empleado recibido antes de editarlo para evitar mutaciones colaterales en la tabla.

## Ejecucion

```bash
npm install
npm start
```

La aplicacion espera el backend en `http://localhost:3000/api/v1/employees`.
