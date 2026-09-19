import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  @Input() employees: ReadonlyArray<Employee> = [];
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() edit = new EventEmitter<Employee>();
  @Output() delete = new EventEmitter<Employee>();
  @Output() clearError = new EventEmitter<void>();

  trackEmployee = (index: number, employee: Employee | null | undefined): string => {
    return employee?.id ?? employee?._id ?? `employee-${index}`;
  };
}
