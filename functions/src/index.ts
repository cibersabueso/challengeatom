import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

const app = express();

// Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// Rutas de usuarios
app.post('/api/users/check', async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      res.status(400).json({ error: 'Email es requerido' });
      return;
    }
    
    const snapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      res.status(200).json({ 
        exists: true, 
        user: {
          id: doc.id,
          ...doc.data()
        } 
      });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error al verificar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/users', async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      res.status(400).json({ error: 'Email es requerido' });
      return;
    }
    
    // Verificar si el usuario ya existe
    const snapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (!snapshot.empty) {
      res.status(400).json({ error: 'El usuario ya existe' });
      return;
    }
    
    const userRef = await db.collection('users').add({
      email,
      createdAt: new Date()
    });
    
    const newUser = await userRef.get();
    
    res.status(201).json({
      id: newUser.id,
      ...newUser.data()
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Rutas de tareas
app.get('/api/tasks', async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.query;
    
    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ error: 'ID de usuario es requerido' });
      return;
    }
    
    const snapshot = await db.collection('tasks')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/tasks/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    
    const doc = await db.collection('tasks').doc(id).get();
    
    if (!doc.exists) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }
    
    res.status(200).json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/tasks', async (req: express.Request, res: express.Response) => {
  try {
    const { title, description, userId } = req.body;
    
    if (!title || !description || !userId) {
      res.status(400).json({ error: 'Título, descripción y userId son requeridos' });
      return;
    }
    
    const taskRef = await db.collection('tasks').add({
      title,
      description,
      userId,
      completed: false,
      createdAt: new Date()
    });
    
    const newTask = await taskRef.get();
    
    res.status(201).json({
      id: newTask.id,
      ...newTask.data()
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/api/tasks/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const changes = req.body;
    
    // Validar que la tarea existe
    const doc = await db.collection('tasks').doc(id).get();
    
    if (!doc.exists) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }
    
    await db.collection('tasks').doc(id).update(changes);
    
    const updatedDoc = await db.collection('tasks').doc(id).get();
    
    res.status(200).json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/tasks/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    
    // Validar que la tarea existe
    const doc = await db.collection('tasks').doc(id).get();
    
    if (!doc.exists) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }
    
    await db.collection('tasks').doc(id).delete();
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Exportar la API como una función Firebase
export const api = functions.https.onRequest(app);