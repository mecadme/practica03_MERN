import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import type { Employee } from './models/employee.model';
import { EmployeeService } from './services/employee.service';
import { EmployeeFormComponent, type EmployeeFormSubmit } from './components/employee-form/employee-form.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EmployeeFormComponent, EmployeeListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  readonly employees$ = this.employeeService.employees$;
  readonly loading$ = this.employeeService.loading$;
  readonly error$ = this.employeeService.error$;

  selectedEmployee: Employee | null = null;

  constructor(private readonly employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.loadEmployees();
  }

  saveEmployee(event: EmployeeFormSubmit): void {
    if (event.id) {
      this.employeeService.updateEmployee(event.id, event.payload);
    } else {
      this.employeeService.createEmployee(event.payload);
    }
  }

  editEmployee(employee: Employee): void {
    this.selectedEmployee = {
      ...employee,
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
      this.clearSelection();
    }
  }

  clearSelection(): void {
    this.selectedEmployee = null;
  }

  reloadEmployees(): void {
    this.employeeService.loadEmployees();
  }

  clearError(): void {
    this.employeeService.clearError();
  }

  private employeeId(employee: Employee | null | undefined): string | null {
    return employee?.id ?? employee?._id ?? null;
  }
}
