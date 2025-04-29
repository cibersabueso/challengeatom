import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Task } from '../../../../core/models/task.model';
import { TaskService } from '../../../../core/services/task.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  error = '';
  taskToEdit: Task | null = null;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar las tareas';
        this.loading = false;
      }
    });
  }

  onTaskCreated(task: Task): void {
    this.tasks.unshift(task);
  }

  onTaskUpdated(updatedTask: Task): void {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
    }
    this.taskToEdit = null;
  }

  onTaskToggle(task: Task): void {
    if (!task.id) return;
    
    this.taskService.toggleCompletion(task.id, !task.completed).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
      },
      error: (err) => {
        this.error = err.message || 'Error al actualizar el estado de la tarea';
      }
    });
  }

  onEditTask(task: Task): void {
    this.taskToEdit = { ...task };
  }

  onTaskDeleted(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
      },
      error: (err) => {
        this.error = err.message || 'Error al eliminar la tarea';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  trackById(index: number, item: Task): string {
    return item.id!;
  }
}