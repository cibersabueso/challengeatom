import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { AuthService } from './auth.service';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  
  const mockUser: User = { id: 'user123', email: 'test@example.com' };
  
  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['isLoggedIn'], {
      currentUser: mockUser
    });
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TaskService,
        { provide: AuthService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });
  
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all tasks for current user', () => {
    const mockTasks: Task[] = [
      { id: 'task1', userId: 'user123', title: 'Task 1', description: 'Description 1', completed: false, createdAt: new Date() },
      { id: 'task2', userId: 'user123', title: 'Task 2', description: 'Description 2', completed: true, createdAt: new Date() }
    ];
    
    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(mockTasks);
    });
    
    const req = httpMock.expectOne(`${environment.apiUrl}/tasks?userId=user123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should create a new task', () => {
    const taskData = { title: 'New Task', description: 'New Description' };
    const mockTask: Task = {
      id: 'newTask',
      userId: 'user123',
      title: 'New Task',
      description: 'New Description',
      completed: false,
      createdAt: new Date()
    };
    
    service.createTask(taskData).subscribe(task => {
      expect(task).toEqual(mockTask);
    });
    
    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.title).toBe(taskData.title);
    expect(req.request.body.description).toBe(taskData.description);
    expect(req.request.body.userId).toBe(mockUser.id);
    expect(req.request.body.completed).toBeFalse();
    req.flush(mockTask);
  });

  it('should update a task', () => {
    const taskId = 'task1';
    const changes = { title: 'Updated Title', completed: true };
    const mockUpdatedTask: Task = {
      id: taskId,
      userId: 'user123',
      title: 'Updated Title',
      description: 'Description',
      completed: true,
      createdAt: new Date()
    };
    
    service.updateTask(taskId, changes).subscribe(task => {
      expect(task).toEqual(mockUpdatedTask);
    });
    
    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(changes);
    req.flush(mockUpdatedTask);
  });

  it('should delete a task', () => {
    const taskId = 'task1';
    
    service.deleteTask(taskId).subscribe(response => {
      expect(response).toBeUndefined();
    });
    
    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should toggle task completion status', () => {
    const taskId = 'task1';
    const completed = true;
    const mockUpdatedTask: Task = {
      id: taskId,
      userId: 'user123',
      title: 'Task 1',
      description: 'Description',
      completed: true,
      createdAt: new Date()
    };
    
    spyOn(service, 'updateTask').and.returnValue(of(mockUpdatedTask));
    
    service.toggleCompletion(taskId, completed).subscribe(task => {
      expect(task).toEqual(mockUpdatedTask);
    });
    
    expect(service.updateTask).toHaveBeenCalledWith(taskId, { completed });
  });
});