import type { IEmployeeRepository } from './employee.repository.interface.js';
import type { IEmployee } from '../models/employee.interface.js';
import { EmpleadoModel } from '../models/empleado.model.js';

export class MongoEmployeeRepository implements IEmployeeRepository {
  async findAll(): Promise<IEmployee[]> {
    const docs = await EmpleadoModel.find().lean().exec();
    return docs.map(doc => ({
      ...doc,
      id: doc._id.toString(),
      _id: doc._id.toString()
    })) as unknown as IEmployee[];
  }

  async findById(id: string): Promise<IEmployee | null> {
    const doc = await EmpleadoModel.findById(id).lean().exec();
    if (!doc) {
      return null;
    }
    return {
      ...doc,
      id: doc._id.toString(),
      _id: doc._id.toString()
    } as unknown as IEmployee;
  }

  async create(employeeData: IEmployee): Promise<IEmployee> {
    const newDoc = new EmpleadoModel(employeeData);
    const savedDoc = await newDoc.save();
    const obj = savedDoc.toObject();
    return {
      ...obj,
      id: obj._id.toString(),
      _id: obj._id.toString()
    } as unknown as IEmployee;
  }

  async update(id: string, employeeData: Partial<IEmployee>): Promise<IEmployee | null> {
    const updatedDoc = await EmpleadoModel.findByIdAndUpdate(id, employeeData, {
      new: true,
      runValidators: true
    })
      .lean()
      .exec();

    if (!updatedDoc) {
      return null;
    }
    return {
      ...updatedDoc,
      id: updatedDoc._id.toString(),
      _id: updatedDoc._id.toString()
    } as unknown as IEmployee;
  }

  async delete(id: string): Promise<boolean> {
    const result = await EmpleadoModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
