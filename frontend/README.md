# Frontend - Retos 3 y 4

Aplicacion Angular 20 para gestionar empleados consumiendo la API REST del backend configurada por entorno.

## Reto 3: Programacion reactiva e inmutabilidad

El problema original era que la vista concentraba el estado local y las llamadas HTTP, lo que mezclaba responsabilidades y favorecia mutaciones directas.

La solucion aplicada fue centralizar el consumo de la API en `EmployeeService`:

- `EmployeeService` encapsula `HttpClient`.
- El estado vive en `BehaviorSubject` privados: `employeesSubject`, `loadingSubject` y `errorSubject`.
- El componente solo consume observables publicos de lectura: `employees$`, `loading$` y `error$`.
- Las operaciones `loadEmployees`, `createEmployee`, `updateEmployee` y `deleteEmployee` actualizan el estado con nuevas referencias.
- La respuesta del backend se normaliza antes de llegar al estado para evitar valores `null`, `undefined` o estructuras incompatibles.
- `AppComponent` no hace llamadas HTTP ni usa `subscribe()`.

Archivos principales:

- `src/app/services/employee.service.ts`
- `src/app/models/employee.model.ts`
- `src/app/app.component.ts`

## Configuracion de API

El frontend genera `src/environments/environment.ts` antes de `npm start`, `npm run build` o `npm run watch`.

Variables soportadas:

- `API_BASE_URL`
- `API_URL`
- `NG_APP_API_BASE_URL`

Ejemplo local:

```bash
API_BASE_URL=http://3.151.244.205:3000/api/v1 npm run build
```

Ejemplo para GitHub Actions:

```yaml
- name: Build frontend
  working-directory: frontend
  env:
    API_BASE_URL: ${{ secrets.API_BASE_URL }}
  run: npm ci && npm run build
```

La URL debe apuntar al prefijo de la API, por ejemplo `http://3.151.244.205:3000/api/v1`. Si accidentalmente termina en `/employees`, el script la normaliza antes de compilar.

## Reto 4: Componentes Smart vs Dumb

El problema original era una vista monolitica que mezclaba formulario, tabla, eventos y orquestacion.

La solucion aplicada divide la interfaz en un componente inteligente y componentes presentacionales:

- `AppComponent` funciona como Smart Component: consume observables con `async` pipe, selecciona empleados y conecta eventos con el servicio.
- `EmployeeFormComponent` funciona como Dumb Component: recibe el empleado y el estado de carga por `@Input()`, y emite guardado/cancelacion con `@Output()`.
- `EmployeeListComponent` funciona como Dumb Component: recibe la lista, carga y error por `@Input()`, y emite editar/eliminar/cerrar error con `@Output()`.
- El formulario clona el empleado recibido antes de editarlo para evitar mutaciones colaterales en la tabla.
- La tabla usa `trackBy` con `id`, `_id` y fallback por indice para conservar renderizado estable.

Archivos principales:

- `src/app/components/employee-form/employee-form.component.ts`
- `src/app/components/employee-form/employee-form.component.html`
- `src/app/components/employee-list/employee-list.component.ts`
- `src/app/components/employee-list/employee-list.component.html`
- `src/app/app.component.html`

## Flujo de datos

1. `AppComponent` solicita datos a `EmployeeService`.
2. `EmployeeService` consulta la API y normaliza `response.data`.
3. `employeesSubject` emite una nueva referencia inmutable.
4. `AppComponent` pasa los datos a los componentes dumb mediante `@Input()`.
5. Los componentes dumb emiten acciones mediante `@Output()`.
6. `AppComponent` delega la accion nuevamente al servicio.

## Ejecucion

```bash
npm install
npm start
```

La aplicacion se sirve por defecto en `http://localhost:4200`.

## Validacion

```bash
npm run build
```

Comprobaciones esperadas:

- El contador de empleados coincide con las filas visibles de la tabla.
- `Actualizar` vuelve a consultar la API.
- Crear, editar y eliminar refrescan la tabla.
- No existen llamadas `HttpClient` ni `subscribe()` dentro de `AppComponent`.
- El formulario y la tabla se comunican solo por `@Input()` y `@Output()`.
