import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, map, switchMap } from 'rxjs';
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

  private fetchEmployees() {
    return this.http.get<ApiResponse<Employee[]>>(this.apiUrl).pipe(map(response => response.data ?? []));
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
}
