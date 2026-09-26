import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule, type NgForm } from '@angular/forms';
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
  @Input() error: string | null = null;

  @Output() save = new EventEmitter<EmployeeFormSubmit>();
  @Output() cancel = new EventEmitter<void>();

  form: EmployeePayload = emptyForm();
  editingId: string | null = null;
  submitted = false;
  saveFailed = false;
  private awaitingSave = false;

  ngOnChanges(changes: SimpleChanges): void {
    if ('employee' in changes) {
      this.syncForm();
    }

    if ('loading' in changes && changes['loading'].previousValue === true && this.loading === false && this.awaitingSave) {
      if (!this.error) {
        this.awaitingSave = false;
        this.reset();
        return;
      }

      this.awaitingSave = false;
      this.saveFailed = true;
    }
  }

  submit(employeeForm: NgForm): void {
    this.submitted = true;

    if (employeeForm.invalid) {
      employeeForm.control.markAllAsTouched();
      return;
    }

    this.awaitingSave = true;
    this.saveFailed = false;
    this.save.emit({
      id: this.editingId,
      payload: {
        nombre: this.form.nombre.trim(),
        cargo: this.form.cargo.trim(),
        departamento: this.form.departamento.trim(),
        sueldo: Number(this.form.sueldo)
      }
    });
  }

  reset(): void {
    this.form = emptyForm();
    this.editingId = null;
    this.submitted = false;
    this.saveFailed = false;
    this.awaitingSave = false;
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
