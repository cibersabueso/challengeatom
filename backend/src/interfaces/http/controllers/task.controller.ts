import { Request, Response } from 'express';
import { FirestoreTaskRepository } from '../../../infrastructure/database/firestore-task.repository';

export class TaskController {
  private taskRepository: FirestoreTaskRepository;

  constructor() {
    this.taskRepository = new FirestoreTaskRepository();
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;
      
      if (!userId || typeof userId !== 'string') {
        res.status(400).json({ error: 'ID de usuario es requerido' });
        return;
      }
      
      const tasks = await this.taskRepository.findAll(userId);
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const task = await this.taskRepository.findById(id);
      
      if (!task) {
        res.status(404).json({ error: 'Tarea no encontrada' });
        return;
      }
      
      res.status(200).json(task);
    } catch (error) {
      console.error('Error al obtener tarea:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, userId } = req.body;
      
      if (!title || !description || !userId) {
        res.status(400).json({ error: 'Título, descripción y userId son requeridos' });
        return;
      }
      
      const newTask = await this.taskRepository.create({
        title,
        description,
        userId,
        completed: false,
        createdAt: new Date()
      });
      
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error al crear tarea:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const changes = req.body;
      
      // Validar que la tarea existe
      const task = await this.taskRepository.findById(id);
      
      if (!task) {
        res.status(404).json({ error: 'Tarea no encontrada' });
        return;
      }
      
      const updatedTask = await this.taskRepository.update(id, changes);
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Validar que la tarea existe
      const task = await this.taskRepository.findById(id);
      
      if (!task) {
        res.status(404).json({ error: 'Tarea no encontrada' });
        return;
      }
      
      await this.taskRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}