# Gestion de Empleados API

Backend REST para la gestion de empleados, desarrollado con Node.js, Express, TypeScript y MongoDB/Mongoose. El proyecto aplica patrones de diseno orientados a mantenibilidad y pruebas, junto con validacion perimetral, respuestas estandarizadas y pruebas de calidad.

```text
Base URL: http://localhost:3000/api/v1
Recurso principal: /employees
```

Tambien existen rutas equivalentes bajo `/empleados` por compatibilidad.

## Tabla de Contenido

- [Stack Tecnologico](#stack-tecnologico)
- [Arquitectura Aplicada](#arquitectura-aplicada)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalacion y Ejecucion](#instalacion-y-ejecucion)
- [Variables de Entorno](#variables-de-entorno)
- [Endpoints](#endpoints)
- [Contrato de Respuesta](#contrato-de-respuesta)
- [Pruebas Unitarias](#pruebas-unitarias)
- [Pruebas de Estres](#pruebas-de-estres)
- [Conclusiones de Calidad](#conclusiones-de-calidad)

## Stack Tecnologico

| Herramienta | Uso |
| --- | --- |
| Node.js | Entorno de ejecucion |
| Express | Framework HTTP |
| TypeScript | Tipado estatico |
| MongoDB Atlas / MongoDB local | Base de datos |
| Mongoose | ODM para MongoDB |
| Zod | Validacion de DTOs |
| Jest | Pruebas unitarias |
| Artillery | Pruebas de estres |

## Arquitectura Aplicada

### Repository Pattern e inversion de dependencias

El controlador no depende directamente de Mongoose. En su lugar, trabaja contra una interfaz de repositorio, lo que reduce el acoplamiento y facilita las pruebas unitarias.

| Componente | Responsabilidad |
| --- | --- |
| `IEmployeeRepository` | Define el contrato de persistencia |
| `MongoEmployeeRepository` | Implementa el contrato usando Mongoose |
| `EmployeeController` | Recibe el repositorio por constructor |
| `empleados.routes.ts` | Instancia e inyecta la implementacion concreta |

Archivos principales:

```text
src/repositories/employee.repository.interface.ts
src/repositories/mongo-employee.repository.ts
src/controllers/empleados.controllers.ts
src/routes/empleados.routes.ts
src/models/empleado.model.ts
```

### DTOs, validacion perimetral y Response Wrapper

La API valida los datos antes de ejecutar la logica del controlador. Las respuestas exitosas y de error mantienen una estructura uniforme.

| Componente | Responsabilidad |
| --- | --- |
| `employee.dto.ts` | Define esquemas de creacion, actualizacion y parametros |
| `validateSchema` | Valida `body`, `params` y `query` con Zod |
| `ResponseWrapper` | Estandariza respuestas exitosas y de error |
| `AppError` | Representa errores controlados del dominio |
| `errorHandler` | Centraliza errores de validacion y errores de aplicacion |

Archivos principales:

```text
src/dtos/employee.dto.ts
src/middlewares/validate.middleware.ts
src/middlewares/error.middleware.ts
src/utils/response.wrapper.ts
src/errors/app.error.ts
```

## Estructura del Proyecto

```text
backend/
|-- src/
|   |-- config/
|   |-- controllers/
|   |-- dtos/
|   |-- errors/
|   |-- middlewares/
|   |-- models/
|   |-- repositories/
|   |-- routes/
|   |-- utils/
|   |-- app.ts
|   `-- index.ts
|-- jest.config.js
|-- stress-test.yml
|-- package.json
`-- README.md
```

## Instalacion y Ejecucion

Instalar dependencias:

```bash
npm install
```

Levantar el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor escucha por defecto en:

```text
http://localhost:3000
```

## Variables de Entorno

Crear un archivo `.env` en la raiz de `backend/`:

```text
MONGO_URI=mongodb://127.0.0.1:27017/usuarios_db
```

Tambien se puede usar MongoDB Atlas:

```text
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/usuarios_db
```

Si `MONGO_URI` no esta definida, el servidor termina antes de aceptar peticiones.

## Endpoints

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| `GET` | `/api/v1/employees` | Lista empleados |
| `POST` | `/api/v1/employees` | Crea un empleado |
| `GET` | `/api/v1/employees/:id` | Obtiene un empleado por id |
| `PUT` | `/api/v1/employees/:id` | Actualiza un empleado |
| `DELETE` | `/api/v1/employees/:id` | Elimina un empleado |

### Ejemplo de creacion

```http
POST http://localhost:3000/api/v1/employees
Content-Type: application/json

{
  "nombre": "Juan Perez",
  "cargo": "Developer",
  "departamento": "Tecnologia",
  "sueldo": 1500
}
```

## Contrato de Respuesta

### Respuesta exitosa

```json
{
  "success": true,
  "data": [],
  "message": "Listado de empleados obtenido exitosamente",
  "status": "Listado de empleados obtenido exitosamente",
  "timestamp": "2026-09-19T00:00:00.000Z"
}
```

### Respuesta de error

```json
{
  "success": false,
  "status": "error",
  "message": "Mensaje del error",
  "error": {
    "code": "ERROR_CODE",
    "details": []
  },
  "timestamp": "2026-09-19T00:00:00.000Z"
}
```

## Pruebas Unitarias

Las pruebas unitarias validan mantenibilidad, modularidad y capacidad de prueba. El controlador se prueba con un mock de `IEmployeeRepository`, por lo que no requiere MongoDB ni Mongoose.

Archivos de prueba:

```text
src/controllers/empleados.controllers.spec.ts
src/middlewares/validate.middleware.spec.ts
```

Ejecutar pruebas:

```bash
npm test
```

En Windows, si PowerShell bloquea scripts:

```bash
npm.cmd test
```

Resultado actual:

```text
Test Suites: 2 passed, 2 total
Tests:       8 passed, 8 total
```

Cobertura funcional de la suite:

| Area | Casos cubiertos |
| --- | --- |
| Controlador | Listar, crear, buscar por id, actualizar y eliminar empleados |
| Repositorio | Uso de la abstraccion `IEmployeeRepository` mediante mocks |
| Errores de dominio | Delegacion de `AppError` cuando un empleado no existe |
| Validacion `400` | Payload de creacion invalido |
| Validacion `400` | Parametro `id` invalido |
| Validacion `400` | Payload de actualizacion invalido |

## Pruebas de Estres

La prueba de estres evalua eficiencia de rendimiento y comportamiento temporal usando Artillery.

Archivo del escenario:

```text
stress-test.yml
```

### Escenario probado

Cada usuario virtual ejecuta dos operaciones:

1. `POST /api/v1/employees` con payload valido. Respuesta esperada: `201`.
2. `POST /api/v1/employees` con payload invalido. Respuesta esperada: `400`.

Esto permite evaluar dos caminos criticos:

- Escritura real en MongoDB para solicitudes validas.
- Rechazo temprano por Zod para solicitudes invalidas.

### Configuracion de carga

| Fase | Duracion | Llegada de usuarios |
| --- | ---: | --- |
| Calentamiento | 20 s | 5 usuarios/s |
| Saturacion maxima | 30 s | rampa de 15 a 50 usuarios/s |

### Ejecucion

Instalar Artillery si no esta disponible:

```bash
npm install -g artillery
```

Levantar el backend:

```bash
npm run dev
```

Ejecutar la prueba:

```bash
npm run stress
```


### Resultados Obtenidos

Ejecucion local realizada el 25 de septiembre de 2026 contra `http://localhost:3000`, con el backend conectado a MongoDB Atlas.

```text
Test run id: tfj9p_t4m86hqf5pdw3nhx5bb73tpwqgh99_nq78

http.requests: 2150
http.responses: 2150
http.codes.201: 1075
http.codes.400: 1075
http.request_rate: 62/sec
http.downloaded_bytes: 748200

vusers.created: 1075
vusers.completed: 1075
vusers.failed: 0

http.response_time.min: 0 ms
http.response_time.max: 1237 ms
http.response_time.mean: 89.1 ms
http.response_time.median: 10.1 ms
http.response_time.p95: 172.5 ms
http.response_time.p99: 210.6 ms
```

### Resumen Ejecutivo

| Indicador | Resultado | Estado |
| --- | ---: | --- |
| Solicitudes totales | 2150 | Correcto |
| Respuestas totales | 2150 | Correcto |
| Usuarios virtuales creados | 1075 | Correcto |
| Usuarios virtuales completados | 1075 | Correcto |
| Usuarios virtuales fallidos | 0 | Correcto |
| Respuestas `201` | 1075 | Correcto |
| Respuestas `400` | 1075 | Correcto |
| Tasa promedio | 62 req/s | Informativo |
| `p99` global | 210.6 ms | No cumple umbral |

### Checks de Artillery

| Check | Resultado | Interpretacion |
| --- | --- | --- |
| `maxErrorRate < 1` | Cumple | No hubo tasa de error critica |
| `http.response_time.p99 < 200` | No cumple | El p99 global supero el limite por 10.6 ms |

El p99 global fue `210.6 ms`, equivalente a un exceso aproximado de `5.3%` frente al umbral de `200 ms`.

### Latencias

| Tipo de respuesta | Min | Max | Media | Mediana | p95 | p99 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Global | 0 ms | 1237 ms | 89.1 ms | 10.1 ms | 172.5 ms | 210.6 ms |
| `2xx` creacion valida | 160 ms | 1237 ms | 176.4 ms | 165.7 ms | 186.8 ms | 459.5 ms |
| `4xx` validacion fallida | 0 ms | 10 ms | 1.9 ms | 2 ms | 4 ms | 5 ms |

La diferencia entre `2xx` y `4xx` muestra que la validacion perimetral es eficiente. Las respuestas invalidas se rechazan casi de inmediato, mientras que las respuestas validas incluyen escritura en MongoDB Atlas y concentran los picos de latencia.

### Usuarios Virtuales

| Metrica | Resultado |
| --- | ---: |
| `vusers.session_length.min` | 1168.5 ms |
| `vusers.session_length.max` | 2280.4 ms |
| `vusers.session_length.mean` | 1194.8 ms |
| `vusers.session_length.median` | 1176.4 ms |
| `vusers.session_length.p95` | 1200.1 ms |
| `vusers.session_length.p99` | 1525.7 ms |

### Graficas

```mermaid
pie title Distribucion de respuestas HTTP
  "201 creados correctamente" : 1075
  "400 rechazados por validacion" : 1075
```

```mermaid
xychart-beta
  title "Latencias p99 por tipo de respuesta"
  x-axis ["Global", "2xx", "4xx"]
  y-axis "Milisegundos" 0 --> 500
  bar [210.6, 459.5, 5]
```

```mermaid
xychart-beta
  title "Tasa de solicitudes durante la prueba"
  x-axis ["20:14:50", "20:15:00", "20:15:10", "20:15:20", "20:15:30", "20:15:40"]
  y-axis "Requests por segundo" 0 --> 90
  line [10, 10, 39, 62, 86, 80]
```

## Conclusiones de Calidad

| Atributo ISO/IEC 25010 | Evidencia | Resultado |
| --- | --- | --- |
| Mantenibilidad | Repository Pattern, DTOs, middlewares y separacion por capas | Cumple |
| Modularidad | Controlador desacoplado de Mongoose mediante `IEmployeeRepository` | Cumple |
| Capacidad de prueba | Pruebas unitarias aisladas con mocks | Cumple |
| Confiabilidad funcional | `1075` respuestas `201` y `1075` respuestas `400` segun el escenario | Cumple |
| Eficiencia de rendimiento | `p99` global de `210.6 ms` frente a umbral de `200 ms` | Cumple parcialmente |

La API se comporto de forma estable durante la prueba de estres: todos los usuarios virtuales completaron el flujo, no hubo fallos de escenario y todas las solicitudes recibieron respuesta. La validacion perimetral funciono correctamente, porque todos los payloads invalidos fueron rechazados con `400`.

El principal punto de mejora esta en la latencia de las operaciones validas de creacion. Como estas solicitudes realizan escritura en MongoDB Atlas, se recomienda revisar indices, latencia de red hacia la base de datos, configuracion del cluster y posibles optimizaciones del flujo de persistencia.
