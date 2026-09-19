export interface IEmployee {
  _id?: string;
  id?: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt?: Date;
  updatedAt?: Date;
}
