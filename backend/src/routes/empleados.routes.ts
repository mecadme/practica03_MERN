import { Router } from 'express';
import { EmployeeController } from '../controllers/empleados.controllers.js';
import { MongoEmployeeRepository } from '../repositories/mongo-employee.repository.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import {
  createEmployeeDto,
  updateEmployeeDto,
  employeeParamsDto
} from '../dtos/employee.dto.js';

const router = Router();

const employeeRepository = new MongoEmployeeRepository();
const employeeController = new EmployeeController(employeeRepository);

router.get('/empleados', employeeController.getEmpleado);
router.post(
  '/empleados',
  validateSchema({ body: createEmployeeDto }),
  employeeController.addEmpleado
);
router.get(
  '/empleados/:id',
  validateSchema({ params: employeeParamsDto }),
  employeeController.getEmpleadoById
);
router.put(
  '/empleados/:id',
  validateSchema({ params: employeeParamsDto, body: updateEmployeeDto }),
  employeeController.updateEmpleado
);
router.delete(
  '/empleados/:id',
  validateSchema({ params: employeeParamsDto }),
  employeeController.deleteEmpleado
);

router.put(
  '/empleados',
  validateSchema({ body: updateEmployeeDto }),
  employeeController.updateEmpleado
);
router.delete(
  '/empleados',
  employeeController.deleteEmpleado
);

router.get('/employees', employeeController.getEmpleado);
router.post(
  '/employees',
  validateSchema({ body: createEmployeeDto }),
  employeeController.addEmpleado
);
router.get(
  '/employees/:id',
  validateSchema({ params: employeeParamsDto }),
  employeeController.getEmpleadoById
);
router.put(
  '/employees/:id',
  validateSchema({ params: employeeParamsDto, body: updateEmployeeDto }),
  employeeController.updateEmpleado
);
router.delete(
  '/employees/:id',
  validateSchema({ params: employeeParamsDto }),
  employeeController.deleteEmpleado
);

export default router;