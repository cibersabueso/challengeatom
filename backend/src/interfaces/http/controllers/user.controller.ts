import { Request, Response } from 'express';
import { FirestoreUserRepository } from '../../../infrastructure/database/firestore-user.repository';

export class UserController {
  private userRepository: FirestoreUserRepository;

  constructor() {
    this.userRepository = new FirestoreUserRepository();
  }

  async checkUser(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      
      if (!email) {
        res.status(400).json({ error: 'Email es requerido' });
        return;
      }
      
      const user = await this.userRepository.findByEmail(email);
      
      if (user) {
        res.status(200).json({ exists: true, user });
      } else {
        res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      
      if (!email) {
        res.status(400).json({ error: 'Email es requerido' });
        return;
      }
      
      // Verificar si el usuario ya existe
      const existingUser = await this.userRepository.findByEmail(email);
      
      if (existingUser) {
        res.status(400).json({ error: 'El usuario ya existe' });
        return;
      }
      
      const newUser = await this.userRepository.create({
        email,
        createdAt: new Date()
      });
      
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}