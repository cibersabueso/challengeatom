import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });
  
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check if user exists', () => {
    const mockEmail = 'test@example.com';
    const mockResponse = { exists: true, user: { id: '1', email: mockEmail } };
    
    service.checkUser(mockEmail).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    
    const req = httpMock.expectOne(`${environment.apiUrl}/users/check`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: mockEmail });
    req.flush(mockResponse);
  });

  it('should create a new user', () => {
    const mockEmail = 'new@example.com';
    const mockUser: User = { id: '2', email: mockEmail, createdAt: new Date() };
    
    service.createUser(mockEmail).subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(service.currentUser).toEqual(mockUser);
      expect(localStorage.getItem('currentUser')).toBeTruthy();
    });
    
    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: mockEmail });
    req.flush(mockUser);
  });

  it('should login a user', () => {
    const mockUser: User = { id: '3', email: 'user@example.com' };
    
    service.login(mockUser).subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(service.currentUser).toEqual(mockUser);
      expect(localStorage.getItem('currentUser')).toBeTruthy();
    });
  });

  it('should logout a user', () => {
    const mockUser: User = { id: '4', email: 'logout@example.com' };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    
    service.logout();
    
    expect(service.currentUser).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('should check if user is logged in', () => {
    expect(service.isLoggedIn()).toBeFalse();
    
    const mockUser: User = { id: '5', email: 'logged@example.com' };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    
    // Recargar el servicio para que lea del localStorage
    service = TestBed.inject(AuthService);
    
    expect(service.isLoggedIn()).toBeTrue();
  });
});