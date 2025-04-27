import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { db } from '../firebase/firebase-config';

export class FirestoreUserRepository implements UserRepository {
  private collection = db.collection('users');

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.collection.where('email', '==', email).limit(1).get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data() as Omit<User, 'id'>
    };
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const docRef = await this.collection.add({
      ...user,
      createdAt: new Date()
    });
    
    const newUser = await docRef.get();
    
    return {
      id: newUser.id,
      ...(newUser.data() as Omit<User, 'id'>)
    };
  }
}