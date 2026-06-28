# Contexto del Proyecto: Sistema de Control de Surtido de Gasolina

Actúa como un desarrollador experto en Full-Stack con experiencia en React, Vite, Bootstrap y Firebase. Tu objetivo es construir un sistema web para el control de surtido de combustible optimizado para dispositivos móviles.

## 🛠️ Stack Tecnológico
- **Frontend:** React (Vite)
- **Estilos:** Bootstrap (Diseño Mobile-First y Responsivo)
- **Base de Datos:** Firebase Firestore
- **Notificaciones:** React Toastify
- **Enrrutado:** react-router-dom
- **Manejo de Estado:** React Hooks (useState, useEffect) o Context API si es necesario.

---

## 🗄️ Estructura de Datos (Firestore)

El agente debe asegurarse de que existan o se creen las siguientes colecciones:

1. **`usuarios`**
   - Documento por usuario.
   - Campos: `username` (string), `password` (string), `rol` (string: "admin" o "cajero").
   - *Nota de inicialización:* Si no existen usuarios, por defecto debe haber uno con `username: "admin"`, `password: "123456"`, `rol: "admin"`.

2. **`registros_gasolina`**
   - Documento por cada surtido.
   - Campos: `placa` (string), `fecha` (Timestamp), `registradoPor` (string - username).

---

## 📋 Requerimientos de Software y Flujo de Trabajo

### 1. Pantalla de Login
- Interfaz limpia y centrada usando Bootstrap.
- Campos: Nombre de usuario (`username`) y Contraseña (`password`).
- Validación contra la colección `usuarios` en Firestore.
- Al iniciar la app por primera vez, verificar si existe el usuario administrador por defecto (`admin` / `123456`); si no, crearlo automáticamente.

### 2. Panel Administrativo (Dashboard)
- **Diseño Responsivo:** Completamente adaptable a teléfonos móviles (Mobile-First) usando las clases de Bootstrap.
- **Acceso:** Solo accesible si el usuario está autenticado. Debe mostrar el nombre del usuario y su rol.
- **Formulario de Registro:**
  - Un campo de texto (`input`) principal para ingresar la **Placa del Vehículo**.
  - Botón de envío estilizado.
  - La placa se debe procesar automáticamente en mayúsculas para evitar duplicados por formato (ej. `ABC123D`).

### 3. Lógica de Validación de Combustible (Regla de Negocio)
Al intentar registrar una placa:
1. Buscar en la colección `registros_gasolina` si existe la misma placa ingresada.
2. Filtrar para comprobar si el registro se realizó **el día de hoy** (entre las 00:00 y las 23:59 del día en curso).
3. **Resultado A (Duplicado):** Si la placa ya surtió hoy, cancelar el registro y mostrar una alerta de error/advertencia usando **React Toastify** indicando que el vehículo ya surtió gasolina hoy.
4. **Resultado B (Exitoso):** Si la placa NO ha surtido hoy, guardarla en Firestore con la marca de tiempo actual (`serverTimestamp()`) y mostrar un mensaje de éxito con **React Toastify**: *"¡Registrado con éxito!"*. Limpiar el input automáticamente tras el éxito.

---

## 🚀 Instrucciones para Comenzar

1. Analiza la estructura del proyecto actual.
2. Genera los archivos de configuración para Firebase (`firebase.js`).
3. Crea los componentes base: `Login.jsx`, `Dashboard.jsx`, y los componentes de UI necesarios.
4. Asegúrate de configurar el proveedor de `ToastContainer` en el punto de entrada de la aplicación (`App.jsx` o `main.jsx`).
5. Proporciona el código limpio, modular y con comentarios breves en español explicando las consultas a Firestore.

## 📂 Estructura de Carpetas del Proyecto

El proyecto debe seguir estrictamente la siguiente estructura dentro del directorio `src/`:

```text
src/
├── assets/         # Imágenes, logos, estilos globales o variables de Bootstrap.
├── components/     # Componentes de UI reutilizables y atómicos (Botones, Inputs, Navbar, Tarjetas).
├── db/             # Configuración de Firebase y funciones puras de comunicación con Firestore.
├── hooks/          # Custom Hooks que manejan toda la lógica de negocio, estado y efectos.
├── pages/          # Pantallas completas de la aplicación (Login, Dashboard).
├── types/          # Interfaces y tipos de TypeScript globales.
├── App.tsx         # Componente raíz y enrutador/control de vistas.
└── main.tsx        # Punto de entrada de la aplicación.

¡Comienza a desarrollar el sistema basándote en estas instrucciones!

