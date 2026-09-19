import type { IEmployee } from '../models/employee.interface.js';

export interface IEmployeeRepository {
  findAll(): Promise<IEmployee[]>;
  findById(id: string): Promise<IEmployee | null>;
  create(employee: IEmployee): Promise<IEmployee>;
  update(id: string, employee: Partial<IEmployee>): Promise<IEmployee | null>;
  delete(id: string): Promise<boolean>;
}
