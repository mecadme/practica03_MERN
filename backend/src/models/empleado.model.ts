import { Schema, model, type Document } from 'mongoose';
import type { IEmployee } from './employee.interface.js';

export interface IEmployeeDocument extends Omit<IEmployee, '_id' | 'id'>, Document {}

const empleadoSchema = new Schema<IEmployeeDocument>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },
    cargo: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    departamento: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    sueldo: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id?.toString();
        return ret;
      }
    }
  }
);

export const EmpleadoModel = model<IEmployeeDocument>('Empleado', empleadoSchema);
export default EmpleadoModel;
