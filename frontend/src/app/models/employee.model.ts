export interface Employee {
  _id?: string;
  id?: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt?: string;
  updatedAt?: string;
}

export type EmployeePayload = Omit<Employee, '_id' | 'id' | 'createdAt' | 'updatedAt'>;

export interface ApiResponse<T> {
  success: boolean;
  status?: string;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
  };
  timestamp: string;
}
