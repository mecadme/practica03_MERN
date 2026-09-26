# Backend - Retos 1 y 2

API REST de empleados construida con Node.js, Express, TypeScript y MongoDB/Mongoose.

La API principal esta disponible en:

```text
Base URL: http://localhost:3000/api/v1

## Despliegue con PM2 en AWS

El backend incluye `ecosystem.config.cjs` adaptado para esta API:

- App PM2: `gestion-empleados-api`
- Entrada: `src/index.ts`
- Puerto: `3000`
- Variable requerida: `MONGO_URI`
- Host configurado: `3.151.244.205`

En el servidor crea el archivo `backend/.env` con tu cadena real de MongoDB:

```env
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/base
PORT=3000
```

Para iniciar o recargar manualmente desde `backend`:

```bash
npm install
npm run pm2:reload
```

Antes de usar `pm2 deploy`, cambia en `backend/ecosystem.config.cjs` los valores `repo` y `ssh_options` por tu repositorio y la ruta local de tu llave `.pem`.
Recurso principal: /employees
```

Tambien se mantienen rutas equivalentes bajo `/empleados` por compatibilidad.

## Reto 1: Repository Pattern e inversion de dependencias

El problema original era que los controladores dependian directamente de Mongoose, mezclando la capa HTTP con la persistencia.

La solucion aplicada fue introducir una abstraccion de repositorio:

- `IEmployeeRepository` define el contrato de persistencia.
- `MongoEmployeeRepository` implementa ese contrato usando Mongoose.
- `EmployeeController` recibe el repositorio por constructor.
- El controlador trabaja contra la interfaz y no importa modelos ni dependencias de Mongoose.
- La ruta instancia la implementacion concreta y la inyecta al controlador.

Archivos principales:

- `src/repositories/employee.repository.interface.ts`
- `src/repositories/mongo-employee.repository.ts`
- `src/controllers/empleados.controllers.ts`
- `src/routes/empleados.routes.ts`
- `src/models/empleado.model.ts`

## Reto 2: DTO, validacion perimetral y Response Wrapper

El problema original era que las entradas HTTP no estaban validadas en tiempo de ejecucion y las respuestas no tenian una forma uniforme.

La solucion aplicada fue agregar validacion con Zod, un middleware reutilizable y un wrapper de respuesta:

- `employee.dto.ts` define DTOs para crear, actualizar y validar parametros.
- `validateSchema` valida `req.body` y `req.params` antes de entrar al controlador.
- `ResponseWrapper.success()` unifica respuestas exitosas.
- `ResponseWrapper.error()` unifica errores.
- `AppError` permite lanzar errores controlados con codigo HTTP y codigo de negocio.
- `errorHandler` centraliza las excepciones del sistema y de validacion.

Archivos principales:

- `src/dtos/employee.dto.ts`
- `src/middlewares/validate.middleware.ts`
- `src/middlewares/error.middleware.ts`
- `src/utils/response.wrapper.ts`
- `src/errors/app.error.ts`

## Contrato de respuesta

Las respuestas exitosas tienen esta forma:

```json
{
  "success": true,
  "data": [],
  "message": "Listado de empleados obtenido exitosamente",
  "status": "Listado de empleados obtenido exitosamente",
  "timestamp": "2026-09-19T00:00:00.000Z"
}
```

Las respuestas de error tienen esta forma:

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

## Endpoints principales

```http
GET    /api/v1/employees
POST   /api/v1/employees
GET    /api/v1/employees/:id
PUT    /api/v1/employees/:id
DELETE /api/v1/employees/:id
```

## Ejecucion

```bash
npm install
npm run dev
```

El servidor escucha por defecto en `http://localhost:3000`.

## Base de datos

La conexion intenta usar primero:

```text
mongodb://admin:admin123@127.0.0.1:27017/usuarios_db?authSource=admin
```

Si falla, intenta como respaldo:

```text
mongodb://127.0.0.1:27017/usuarios_db
```

Tambien se puede configurar `MONGO_URI` por variable de entorno.

## Validacion rapida

Crear empleado:

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

Listar empleados:

```http
GET http://localhost:3000/api/v1/employees
```

La respuesta debe devolver `success: true` y un arreglo en `data`.
