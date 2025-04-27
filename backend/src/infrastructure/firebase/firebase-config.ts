import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Inicializar Firebase Admin
admin.initializeApp();

export const db = admin.firestore();
export { admin, functions };