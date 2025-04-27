import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { TaskController } from '../controllers/task.controller';

const router = Router();
const userController = new UserController();
const taskController = new TaskController();

// Rutas de usuarios
router.post('/users/check', (req, res) => userController.checkUser(req, res));
router.post('/users', (req, res) => userController.createUser(req, res));

// Rutas de tareas
router.get('/tasks', (req, res) => taskController.getTasks(req, res));
router.get('/tasks/:id', (req, res) => taskController.getTask(req, res));
router.post('/tasks', (req, res) => taskController.createTask(req, res));
router.put('/tasks/:id', (req, res) => taskController.updateTask(req, res));
router.delete('/tasks/:id', (req, res) => taskController.deleteTask(req, res));

export default router;