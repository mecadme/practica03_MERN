import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Employee, EmployeePayload } from '../../models/employee.model';

export interface EmployeeFormSubmit {
  id: string | null;
  payload: EmployeePayload;
}

const emptyForm = (): EmployeePayload => ({
  nombre: '',
  cargo: '',
  departamento: '',
  sueldo: 0
});

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnChanges {
  @Input() employee: Employee | null = null;
  @Input() loading = false;

  @Output() save = new EventEmitter<EmployeeFormSubmit>();
  @Output() cancel = new EventEmitter<void>();

  form: EmployeePayload = emptyForm();
  editingId: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if ('employee' in changes) {
      this.syncForm();
    }
  }

  submit(): void {
    this.save.emit({
      id: this.editingId,
      payload: {
        ...this.form,
        sueldo: Number(this.form.sueldo)
      }
    });

    this.reset();
  }

  reset(): void {
    this.form = emptyForm();
    this.editingId = null;
    this.cancel.emit();
  }

  private syncForm(): void {
    if (!this.employee) {
      this.form = emptyForm();
      this.editingId = null;
      return;
    }

    this.editingId = this.employee.id ?? this.employee._id ?? null;
    this.form = {
      nombre: this.employee.nombre,
      cargo: this.employee.cargo,
      departamento: this.employee.departamento,
      sueldo: this.employee.sueldo
    };
  }
}
