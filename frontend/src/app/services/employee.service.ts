import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, map, Observable, switchMap } from 'rxjs';
import type { ApiResponse, Employee, EmployeePayload } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/employees';

  private readonly employeesSubject = new BehaviorSubject<ReadonlyArray<Employee>>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  readonly employees$ = this.employeesSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadEmployees(): void {
    this.startRequest();
    this.fetchEmployees()
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: employees => this.employeesSubject.next([...employees]),
        error: error => this.errorSubject.next(this.readErrorMessage(error))
      });
  }

  createEmployee(payload: EmployeePayload): void {
    this.startRequest();
    this.http
      .post<ApiResponse<Employee>>(this.apiUrl, payload)
      .pipe(
        switchMap(() => this.fetchEmployees()),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe({
        next: employees => this.employeesSubject.next([...employees]),
        error: error => this.errorSubject.next(this.readErrorMessage(error))
      });
  }

  updateEmployee(id: string, payload: EmployeePayload): void {
    this.startRequest();
    this.http
      .put<ApiResponse<Employee>>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        switchMap(() => this.fetchEmployees()),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe({
        next: employees => this.employeesSubject.next([...employees]),
        error: error => this.errorSubject.next(this.readErrorMessage(error))
      });
  }

  deleteEmployee(id: string): void {
    this.startRequest();
    this.http
      .delete<ApiResponse<null>>(`${this.apiUrl}/${id}`)
      .pipe(
        switchMap(() => this.fetchEmployees()),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe({
        next: employees => this.employeesSubject.next([...employees]),
        error: error => this.errorSubject.next(this.readErrorMessage(error))
      });
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  private fetchEmployees(): Observable<ReadonlyArray<Employee>> {
    return this.http
      .get<ApiResponse<unknown>>(this.apiUrl)
      .pipe(map(response => this.normalizeEmployees(response.data)));
  }

  private startRequest(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
  }

  private readErrorMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const httpError = error as { error?: { message?: string } };
      return httpError.error?.message ?? 'No se pudo completar la operacion solicitada';
    }

    return 'No se pudo completar la operacion solicitada';
  }

  private normalizeEmployees(data: unknown): ReadonlyArray<Employee> {
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map(employee => this.normalizeEmployee(employee))
      .filter((employee): employee is Employee => employee !== null);
  }

  private normalizeEmployee(value: unknown): Employee | null {
    if (!this.isRecord(value)) {
      return null;
    }

    const nombre = this.toText(value['nombre']);
    const cargo = this.toText(value['cargo']);
    const departamento = this.toText(value['departamento']);
    const sueldo = this.toNumber(value['sueldo']);

    if (!nombre || !cargo || !departamento || sueldo === null) {
      return null;
    }

    const employee: Employee = {
      nombre,
      cargo,
      departamento,
      sueldo
    };

    const id = this.toOptionalText(value['id']);
    const mongoId = this.toOptionalText(value['_id']);
    const createdAt = this.toOptionalText(value['createdAt']);
    const updatedAt = this.toOptionalText(value['updatedAt']);

    if (id) {
      employee.id = id;
    }

    if (mongoId) {
      employee._id = mongoId;
    }

    if (createdAt) {
      employee.createdAt = createdAt;
    }

    if (updatedAt) {
      employee.updatedAt = updatedAt;
    }

    return employee;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private toText(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private toOptionalText(value: unknown): string | undefined {
    if (typeof value === 'string') {
      const trimmedValue = value.trim();
      return trimmedValue || undefined;
    }

    if (typeof value === 'number') {
      return String(value);
    }

    return undefined;
  }

  private toNumber(value: unknown): number | null {
    const numberValue = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
  }
}
