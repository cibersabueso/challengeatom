import { FirestoreTaskRepository } from './firestore-task.repository';
import { Task } from '../../domain/entities/task.entity';

// Mock para Firestore
const mockCollection = {
  add: jest.fn(),
  doc: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  get: jest.fn(),
};

const mockFirestore = {
  collection: jest.fn(() => mockCollection),
};

jest.mock('../firebase/firebase-config', () => ({
  db: {
    collection: () => mockCollection,
  },
}));

describe('FirestoreTaskRepository', () => {
  let repository: FirestoreTaskRepository;
  const userId = 'user123';
  
  beforeEach(() => {
    jest.clearAllMocks();
    repository = new FirestoreTaskRepository();
  });

  it('should find all tasks for a user', async () => {
    const mockTasks = [
      { id: 'task1', userId, title: 'Task 1', description: 'Desc 1', completed: false, createdAt: new Date() },
      { id: 'task2', userId, title: 'Task 2', description: 'Desc 2', completed: true, createdAt: new Date() },
    ];
    
    const mockSnapshot = {
      docs: mockTasks.map(task => ({
        id: task.id,
        data: () => ({ ...task, id: undefined }),
      })),
    };
    
    mockCollection.where.mockReturnValue(mockCollection);
    mockCollection.orderBy.mockReturnValue(mockCollection);
    mockCollection.get.mockResolvedValue(mockSnapshot);
    
    const result = await repository.findAll(userId);
    
    expect(mockCollection.where).toHaveBeenCalledWith('userId', '==', userId);
    expect(mockCollection.orderBy).toHaveBeenCalledWith('createdAt', 'desc');
    expect(mockCollection.get).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('task1');
    expect(result[1].id).toBe('task2');
  });

  it('should create a new task', async () => {
    const newTask: Omit<Task, 'id'> = {
      userId,
      title: 'New Task',
      description: 'New Description',
      completed: false,
      createdAt: new Date(),
    };
    
    const mockDocRef = {
      id: 'newTaskId',
      get: jest.fn().mockResolvedValue({
        id: 'newTaskId',
        data: () => newTask,
      }),
    };
    
    mockCollection.add.mockResolvedValue(mockDocRef);
    
    const result = await repository.create(newTask);
    
    expect(mockCollection.add).toHaveBeenCalledWith(expect.objectContaining({
      userId,
      title: 'New Task',
      description: 'New Description',
      completed: false,
    }));
    expect(result.id).toBe('newTaskId');
    expect(result.title).toBe(newTask.title);
  });

  it('should find a task by id', async () => {
    const taskId = 'task123';
    const taskData = {
      userId,
      title: 'Found Task',
      description: 'Task Description',
      completed: false,
      createdAt: new Date(),
    };
    
    const mockDoc = {
      id: taskId,
      exists: true,
      data: () => taskData,
    };
    
    mockCollection.doc.mockReturnValue({ get: jest.fn().mockResolvedValue(mockDoc) });
    
    const result = await repository.findById(taskId);
    
    expect(mockCollection.doc).toHaveBeenCalledWith(taskId);
    expect(result?.id).toBe(taskId);
    expect(result?.title).toBe(taskData.title);
  });

  it('should return null when task not found', async () => {
    const taskId = 'nonexistent';
    
    const mockDoc = {
      exists: false,
    };
    
    mockCollection.doc.mockReturnValue({ get: jest.fn().mockResolvedValue(mockDoc) });
    
    const result = await repository.findById(taskId);
    
    expect(result).toBeNull();
  });
});