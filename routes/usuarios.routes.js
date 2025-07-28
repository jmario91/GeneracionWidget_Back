import express from 'express';
import {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  eliminarUsuarioPermanente,
  reactivarUsuario
} from '../controllers/usuarios.controller.js';

const router = express.Router();

// CREATE - Crear un nuevo usuario
// POST /api/usuarios
router.post('/', crearUsuario);

// READ - Obtener todos los usuarios con paginación y filtros
// GET /api/usuarios?page=1&limit=10&activo=true&search=juan
router.get('/', obtenerUsuarios);

// READ - Obtener un usuario específico por ID
// GET /api/usuarios/:id
router.get('/:id', obtenerUsuarioPorId);

// UPDATE - Actualizar un usuario
// PUT /api/usuarios/:id
router.put('/:id', actualizarUsuario);

// DELETE - Eliminar usuario (soft delete - marcar como inactivo)
// DELETE /api/usuarios/:id
router.delete('/:id', eliminarUsuario);

// DELETE - Eliminar usuario permanentemente
// DELETE /api/usuarios/:id/permanente
router.delete('/:id/permanente', eliminarUsuarioPermanente);

// UTILITY - Reactivar un usuario
// PATCH /api/usuarios/:id/reactivar
router.patch('/:id/reactivar', reactivarUsuario);

export default router;