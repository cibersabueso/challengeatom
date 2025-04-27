import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../../../core/models/task.model';
import { TaskService } from '../../../../core/services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnChanges {
  @Input() taskToEdit: Task | null = null;
  @Output() taskCreated = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();
  
  taskForm: FormGroup;
  loading = false;
  error = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService
  ) {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.taskForm.patchValue({
        title: this.taskToEdit.title,
        description: this.taskToEdit.description
      });
    } else if (changes['taskToEdit'] && !this.taskToEdit) {
      this.taskForm.reset();
    }
  }
  
  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }
    
    const formValue = this.taskForm.value;
    this.loading = true;
    this.error = '';
    
    if (this.taskToEdit && this.taskToEdit.id) {
      // Actualizar tarea existente
      this.taskService.updateTask(this.taskToEdit.id, formValue).subscribe({
        next: (updatedTask) => {
          this.taskUpdated.emit(updatedTask);
          this.taskForm.reset();
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Error al actualizar la tarea';
          this.loading = false;
        }
      });
    } else {
      // Crear nueva tarea
      this.taskService.createTask(formValue).subscribe({
        next: (newTask) => {
          this.taskCreated.emit(newTask);
          this.taskForm.reset();
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Error al crear la tarea';
          this.loading = false;
        }
      });
    }
  }
  
  cancelEdit(): void {
    this.taskForm.reset();
    this.taskToEdit = null;
  }
}