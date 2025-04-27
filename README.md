# Challenge Técnico - Administrador de Tareas

Este proyecto es una aplicación de administración de tareas desarrollada con Angular para el frontend y Express + Firebase para el backend. Permite a los usuarios gestionar sus tareas personales de manera eficiente.

## Características

- Autenticación de usuarios por correo electrónico
- Gestión completa de tareas: crear, editar, eliminar y marcar como completadas
- Interfaz responsiva adaptada a diferentes dispositivos
- Arquitectura limpia con separación clara de responsabilidades
- API RESTful con Express y TypeScript
- Almacenamiento en Firebase Firestore

## Tecnologías utilizadas

### Frontend

- Angular 17 (Standalone Components)
- RxJS para gestión de estado y operaciones asíncronas
- Angular Reactive Forms para validación de formularios
- SCSS para estilos
- Lazy loading para optimización de carga

### Backend

- Express
- TypeScript
- Firebase Cloud Functions
- Firebase Firestore

## Arquitectura

El proyecto sigue los principios de arquitectura limpia (Clean Architecture) y patrones de diseño SOLID:

### Frontend

- **Core**: Contiene modelos, servicios y guards centrales
- **Features**: Módulos funcionales (auth, tasks)
- **Shared**: Componentes, directivas y pipes reutilizables

### Backend

- **Domain**: Entidades y interfaces de repositorio
- **Infrastructure**: Implementaciones concretas (Firebase)
- **Interfaces**: Controladores HTTP y rutas

## Estructura del proyecto

```
challengetecnico/
├── frontend/
│   └── task-manager/
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/
│       │   │   │   ├── guards/
│       │   │   │   ├── models/
│       │   │   │   └── services/
│       │   │   ├── features/
│       │   │   │   ├── auth/
│       │   │   │   └── tasks/
│       │   │   └── shared/
│       │   ├── assets/
│       │   └── environments/
│       └── ...
└── backend/
    ├── src/
    │   ├── domain/
    │   │   ├── entities/
    │   │   └── repositories/
    │   ├── infrastructure/
    │   │   ├── database/
    │   │   └── firebase/
    │   ├── interfaces/
    │   │   ├── http/
    │   │   │   ├── controllers/
    │   │   │   └── routes/
    │   │   └── ...
    │   └── index.ts
    └── ...
```

## Patrones y buenas prácticas implementadas

### Principios SOLID

- **Single Responsibility**: Cada clase tiene una única responsabilidad
- **Open/Closed**: Entidades extendibles sin modificar código existente
- **Liskov Substitution**: Implementaciones respetan contratos de interfaces
- **Interface Segregation**: Interfaces específicas para cada necesidad
- **Dependency Inversion**: Dependencia de abstracciones, no concreciones

### Patrones de diseño

- **Repository pattern**: Abstracción del acceso a datos
- **Dependency Injection**: Inyección de servicios en componentes
- **Observer (RxJS)**: Manejo de eventos y datos asíncronos
- **Module pattern**: Organización de código en módulos independientes

### Código limpio

- Nombres descriptivos para variables y funciones
- Funciones pequeñas con propósito único
- Manejo adecuado de errores y excepciones
- Uso de tipado estricto con TypeScript

## Configuración y ejecución

### Requisitos previos

- Node.js (v16+)
- Angular CLI
- Cuenta en Firebase

### Frontend

```bash
# Instalación
cd frontend/task-manager
npm install

# Desarrollo
ng serve

# Producción
ng build --configuration production
```

### Backend

```bash
# Instalación
cd backend
npm install

# Desarrollo local
npm run dev

# Despliegue en Firebase Functions
npm run build
firebase deploy --only functions
```

### Configuración de Firebase

1. Crear un proyecto en Firebase Console
2. Habilitar Firestore y Authentication
3. Configurar las credenciales en el backend:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login en Firebase
firebase login

# Inicializar proyecto
firebase init functions

# Seleccionar proyecto creado anteriormente
```

4. Actualizar la configuración en `/frontend/task-manager/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://us-central1-[TU-PROYECTO-ID].cloudfunctions.net/api'
};
```

### Despliegue completo

1. Construir el frontend:

```bash
cd frontend/task-manager
ng build --configuration production
```

2. Desplegar backend y hosting:

```bash
cd backend
firebase deploy
```

3. Acceder a la aplicación en la URL proporcionada por Firebase Hosting

## Decisiones de diseño

- **Componentes Standalone**: Se utilizó el nuevo enfoque de Angular 17 para mejorar rendimiento y modularidad
- **Formularios Reactivos**: Para validación robusta del lado del cliente
- **Arquitectura de Repositorio**: Para aislar la lógica de acceso a datos
- **Lazy Loading**: Para optimizar tiempos de carga iniciales
- **LocalStorage**: Para persistencia básica de la sesión de usuario

## Mejoras futuras

- Implementar autenticación más robusta con JWT
- Añadir pruebas unitarias y e2e
- Implementar filtros de búsqueda para tareas
- Añadir categorías y etiquetas para tareas
- Mejorar la experiencia de usuario con animaciones y transiciones
- Implementar PWA para funcionamiento offline

## Autor

Este proyecto fue desarrollado como parte de un desafío técnico fullstack.