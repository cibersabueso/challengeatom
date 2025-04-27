import * as express from 'express';
import * as cors from 'cors';
import { functions } from './infrastructure/firebase/firebase-config';
import routes from './interfaces/http/routes';

const app = express();

// Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// Rutas
app.use('/api', routes);

// Manejo de errores
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Exportar la API como una función Firebase
export const api = functions.https.onRequest(app);

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}