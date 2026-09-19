import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Employee, EmployeePayload } from './models/employee.model';
import { EmployeeService } from './services/employee.service';

const emptyForm = (): EmployeePayload => ({
  nombre: '',
  cargo: '',
  departamento: '',
  sueldo: 0
});

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  readonly employees$ = this.employeeService.employees$;
  readonly loading$ = this.employeeService.loading$;
  readonly error$ = this.employeeService.error$;

  form: EmployeePayload = emptyForm();
  editingId: string | null = null;

  constructor(private readonly employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.loadEmployees();
  }

  saveEmployee(): void {
    const payload = {
      ...this.form,
      sueldo: Number(this.form.sueldo)
    };

    if (this.editingId) {
      this.employeeService.updateEmployee(this.editingId, payload);
    } else {
      this.employeeService.createEmployee(payload);
    }

    this.resetForm();
  }

  editEmployee(employee: Employee): void {
    this.editingId = this.employeeId(employee);
    this.form = {
      nombre: employee.nombre,
      cargo: employee.cargo,
      departamento: employee.departamento,
      sueldo: employee.sueldo
    };
  }

  deleteEmployee(employee: Employee): void {
    const id = this.employeeId(employee);
    if (id) {
      this.employeeService.deleteEmployee(id);
    }
  }

  resetForm(): void {
    this.form = emptyForm();
    this.editingId = null;
  }

  reloadEmployees(): void {
    this.employeeService.loadEmployees();
  }

  clearError(): void {
    this.employeeService.clearError();
  }

  trackEmployee(_index: number, employee: Employee): string {
    return this.employeeId(employee) ?? employee.nombre;
  }

  private employeeId(employee: Employee): string | null {
    return employee.id ?? employee._id ?? null;
  }
}
