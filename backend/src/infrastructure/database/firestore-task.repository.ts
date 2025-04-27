import { Task } from '../../domain/entities/task.entity';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { db } from '../firebase/firebase-config';

export class FirestoreTaskRepository implements TaskRepository {
  private collection = db.collection('tasks');

  async findAll(userId: string): Promise<Task[]> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Task, 'id'>)
    }));
  }

  async findById(id: string): Promise<Task | null> {
    const doc = await this.collection.doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return {
      id: doc.id,
      ...(doc.data() as Omit<Task, 'id'>)
    };
  }

  async create(task: Omit<Task, 'id'>): Promise<Task> {
    const docRef = await this.collection.add({
      ...task,
      createdAt: new Date()
    });
    
    const newTask = await docRef.get();
    
    return {
      id: newTask.id,
      ...(newTask.data() as Omit<Task, 'id'>)
    };
  }

  async update(id: string, changes: Partial<Task>): Promise<Task> {
    await this.collection.doc(id).update(changes);
    const updatedDoc = await this.collection.doc(id).get();
    
    return {
      id: updatedDoc.id,
      ...(updatedDoc.data() as Omit<Task, 'id'>)
    };
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}