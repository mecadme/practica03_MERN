import { z } from 'zod';

export const createEmployeeDto = z.object({
  nombre: z
    .string({
      error: 'El nombre es requerido'
    })
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  cargo: z
    .string({
      error: 'El cargo es requerido'
    })
    .trim()
    .min(2, 'El cargo debe tener al menos 2 caracteres')
    .max(100, 'El cargo no puede exceder 100 caracteres'),
  departamento: z
    .string({
      error: 'El departamento es requerido'
    })
    .trim()
    .min(2, 'El departamento debe tener al menos 2 caracteres')
    .max(100, 'El departamento no puede exceder 100 caracteres'),
  sueldo: z
    .number({
      error: 'El sueldo es requerido'
    })
    .gt(0, 'El sueldo debe ser un número positivo mayor a cero')
});

export const updateEmployeeDto = createEmployeeDto.partial();

export const employeeParamsDto = z.object({
  id: z
    .string({
      error: 'El parámetro id es requerido'
    })
    .regex(/^[0-9a-fA-F]{24}$/, 'El identificador debe ser un ObjectId válido de 24 caracteres hexadecimales')
});

export type CreateEmployeeDto = z.infer<typeof createEmployeeDto>;
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeDto>;
export type EmployeeParamsDto = z.infer<typeof employeeParamsDto>;
