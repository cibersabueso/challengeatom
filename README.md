# Challenge Técnico - Administrador de Tareas

Este proyecto es una aplicación completa de administración de tareas desarrollada con Angular para el frontend y Express con Firebase para el backend. Permite a los usuarios gestionar sus tareas personales de manera eficiente y elegante.

## Demo en vivo

Puedes acceder a la aplicación desplegada y probarla en:
**[https://challengeatom-ae4e4.web.app](https://challengeatom-ae4e4.web.app)**

## Características

- **Autenticación de usuarios** por correo electrónico con persistencia de sesión
- **Gestión completa de tareas (CRUD)**: 
  - Crear nuevas tareas
  - Visualizar lista de tareas ordenadas por fecha
  - Editar tareas existentes
  - Eliminar tareas
  - Marcar tareas como completadas
- **Interfaz responsive** adaptada a múltiples dispositivos
- **Arquitectura limpia** con separación clara de responsabilidades
- **API RESTful** construida con Express y TypeScript
- **Base de datos NoSQL** con Firebase Firestore
- **Despliegue serverless** utilizando Firebase Cloud Functions y Hosting

## Tecnologías utilizadas

### Frontend

- **Angular 17** con el nuevo enfoque de Standalone Components
- **RxJS** para manejo de operaciones asíncronas y gestión de estado
- **Angular Reactive Forms** para validación robusta de formularios
- **SCSS** para estilos modularizados y reutilizables
- **Lazy loading** para optimización de carga y rendimiento

### Backend

- **Express.js** como framework de servidor
- **TypeScript** para tipado estático y mejor mantenibilidad
- **Firebase Cloud Functions** para arquitectura serverless
- **Firebase Firestore** como base de datos NoSQL
- **Firebase Hosting** para el despliegue del frontend

## Arquitectura

El proyecto implementa una arquitectura limpia (Clean Architecture) siguiendo principios SOLID:

### Frontend

La estructura del frontend está organizada en módulos funcionales:

- **Core**: Contiene modelos, servicios y guards centrales de la aplicación
  - Modelos de dominio (User, Task)
  - Servicios principales (AuthService, TaskService)
  - Guards de autenticación
- **Features**: Módulos funcionales específicos
  - Auth: Componentes y servicios de autenticación
  - Tasks: Componentes y servicios de gestión de tareas
- **Shared**: Componentes y utilidades reutilizables

### Backend

El backend sigue una arquitectura en capas:

- **Domain**: Define las entidades y contratos del dominio
  - Entidades (User, Task)
  - Interfaces de repositorio
- **Infrastructure**: Implementaciones técnicas específicas
  - Configuración de Firebase
  - Implementaciones de repositorios con Firestore
- **Interfaces**: Puntos de entrada a la aplicación
  - Controladores HTTP
  - Definición de rutas
  - Middleware

## Estructura del proyecto

```
challengeatom/
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
└── functions/
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

- **Single Responsibility**: Cada clase tiene una única responsabilidad bien definida
- **Open/Closed**: Entidades extensibles sin necesidad de modificar código existente
- **Liskov Substitution**: Las implementaciones respetan los contratos definidos en las interfaces
- **Interface Segregation**: Interfaces específicas y cohesivas para cada necesidad
- **Dependency Inversion**: Dependencia de abstracciones, no de implementaciones concretas

### Patrones de diseño

- **Repository Pattern**: Abstracción del acceso a datos para desacoplar la lógica de negocio
- **Dependency Injection**: Inyección de servicios en componentes para mejorar testabilidad
- **Observer Pattern (RxJS)**: Manejo reactivo de eventos y datos asíncronos
- **Module Pattern**: Organización de código en módulos independientes y cohesivos
- **Strategy Pattern**: Implementación de diferentes estrategias de persistencia

### Código limpio

- Nombres descriptivos para variables, funciones y clases
- Funciones pequeñas con responsabilidad única
- Manejo explícito y elegante de errores y excepciones
- Uso de tipado estricto con TypeScript
- Comentarios estratégicos para explicar "por qué" en lugar de "qué"

## Configuración y ejecución

### Requisitos previos

- Node.js (v16 o superior)
- Angular CLI (v17 o superior)
- Cuenta en Firebase (gratuita)
- Firebase CLI instalado globalmente

### Frontend (desarrollo local)

```bash
# Instalación de dependencias
cd frontend/task-manager
npm install

# Servidor de desarrollo
ng serve

# Compilación para producción
ng build --configuration production
```

### Backend (desarrollo local)

```bash
# Instalación de dependencias
cd functions
npm install

# Compilación de TypeScript
npm run build

# Emuladores de Firebase
firebase emulators:start
```

### Configuración de Firebase

1. Crear un proyecto en Firebase Console
2. Habilitar Firestore y configurar reglas de seguridad
3. Configurar las credenciales de Firebase:

```bash
# Instalar Firebase CLI (si no está instalado)
npm install -g firebase-tools

# Iniciar sesión en Firebase
firebase login

# Inicializar el proyecto
firebase init
```

4. Actualizar la configuración en `frontend/task-manager/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://us-central1-challengeatom-ae4e4.cloudfunctions.net/api'
};
```

### Despliegue completo

```bash
# Construir el frontend
cd frontend/task-manager
ng build --configuration production

# Desplegar todo (funciones y hosting)
firebase deploy
```

## Flujo de trabajo de desarrollo

1. **Configuración del entorno**: Inicialización del proyecto con Angular CLI y Firebase
2. **Desarrollo basado en funcionalidades**: Implementación incremental por módulos funcionales
3. **Pruebas manuales**: Verificación de funcionalidad en entorno local
4. **Despliegue continuo**: Integración y despliegue en Firebase

## Decisiones de diseño

- **Standalone Components**: Utilización del nuevo enfoque de Angular 17 para mejorar rendimiento y modularidad
- **Formularios Reactivos**: Implementación de validación robusta del lado del cliente
- **Arquitectura de Repositorio**: Aislamiento de la lógica de acceso a datos
- **Lazy Loading**: Optimización de tiempos de carga iniciales
- **LocalStorage**: Persistencia básica de la sesión de usuario
- **Diseño Responsive**: Adaptación a diferentes tamaños de pantalla con CSS Grid y Flexbox
- **Manejo de errores centralizado**: Intercepción y procesamiento uniforme de errores HTTP

## Mejoras futuras

- **Autenticación avanzada**: Implementar JWT para mayor seguridad
- **Testing**: Añadir pruebas unitarias, de integración y e2e
- **Búsqueda y filtrado**: Implementar filtros para facilitar la búsqueda de tareas
- **Categorización**: Añadir categorías y etiquetas para organizar tareas
- **Experiencia de usuario mejorada**: Implementar animaciones, transiciones y feedback visual
- **PWA**: Convertir la aplicación para funcionamiento offline
- **Notificaciones**: Implementar recordatorios y notificaciones push
- **Sincronización en tiempo real**: Actualización en tiempo real con Firestore

## Contacto y soporte

Para preguntas o sugerencias sobre este proyecto, puedes contactarme a través de:

## Autor

Este proyecto fue desarrollado como parte de un desafío técnico fullstack por Enrique G.

