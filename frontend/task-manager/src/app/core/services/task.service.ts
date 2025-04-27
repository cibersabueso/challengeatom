import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getTasks(): Observable<Task[]> {
    const userId = this.authService.currentUser?.id;
    if (!userId) {
      return throwError(() => new Error('Usuario no autenticado'));
    }
    
    const params = new HttpParams().set('userId', userId);
    
    return this.http.get<Task[]>(this.apiUrl, { params })
      .pipe(
        map(tasks => tasks.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )),
        catchError(error => {
          console.error('Error fetching tasks:', error);
          return throwError(() => new Error('Error al obtener las tareas'));
        })
      );
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching task:', error);
          return throwError(() => new Error('Error al obtener la tarea'));
        })
      );
  }

  createTask(task: { title: string; description: string }): Observable<Task> {
    const userId = this.authService.currentUser?.id;
    if (!userId) {
      return throwError(() => new Error('Usuario no autenticado'));
    }
    
    const newTask: Omit<Task, 'id'> = {
      ...task,
      userId,
      completed: false,
      createdAt: new Date()
    };
    
    return this.http.post<Task>(this.apiUrl, newTask)
      .pipe(
        catchError(error => {
          console.error('Error creating task:', error);
          return throwError(() => new Error('Error al crear la tarea'));
        })
      );
  }

  updateTask(id: string, changes: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, changes)
      .pipe(
        catchError(error => {
          console.error('Error updating task:', error);
          return throwError(() => new Error('Error al actualizar la tarea'));
        })
      );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting task:', error);
          return throwError(() => new Error('Error al eliminar la tarea'));
        })
      );
  }

  toggleCompletion(id: string, completed: boolean): Observable<Task> {
    return this.updateTask(id, { completed });
  }
}