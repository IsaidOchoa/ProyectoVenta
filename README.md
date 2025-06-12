# Proyecto Venta Walmart

Este proyecto es un sistema de ventas tipo Walmart, desarrollado en PHP y React.

## Requisitos

- PHP 8.x
- MySQL
- Node.js y npm

## Instalación

**Repositorio:**
https://github.com/IsaidOchoa/ProyectoVenta

1. **Clona el repositorio:**
git clone https://github.com/IsaidOchoa/ProyectoVenta.git

2. **Crea la base de datos:**
- Abre tu gestor de base de datos (MySQL Workbench, phpMyAdmin, etc.).
- Ejecuta el script [`walmart.sql`](./walmart.sql) incluido en la raíz del proyecto para crear la base de datos y las tablas necesarias.

3. **Instala las dependencias del frontend:**
En terminal de visual ejecuta
    1. npm install
    2. cd cliente
    3. npm install

4. **Inicia el servidor Apache/MySQL (con XAMPP)**

5. **Inicia el frontend con:**
    1. cd cliente (si ya estas en la direccion ..\ProyectoVenta\cliente ignora y sigue al paso 2)
    2. npm start

**Guarda el archivo** y súbelo a tu repositorio.  
Puedes personalizar el contenido según tus necesidades.

**Manual de usuario:**
https://youtu.be/fsic-WMQG4Y?si=Z-Q4mwp5r1vmV-c-

**NOTAS:**
-El script incluye a un admin pero ningun cliente (debes crearlo en el registro login)
-El usuario admin por defecto es:
Correo: admin2@example.com
Contraseña: 123456 (la contraseña está encriptada, cámbiala si lo necesitas ya que estes dentro del proyecto)