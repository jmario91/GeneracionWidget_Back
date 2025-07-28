import Usuario from '../models/usuario.model.js';

// CREATE - Crear un nuevo usuario
export const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    const usuarioGuardado = await nuevoUsuario.save();
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: usuarioGuardado
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado',
        error: 'Email duplicado'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errores
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// READ - Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const { page = 1, limit = 10, activo, search } = req.query;
    const filtros = {};
    
    // Filtro por estado activo
    if (activo !== undefined) {
      filtros.activo = activo === 'true';
    }
    
    // Búsqueda por nombre o email
    if (search) {
      filtros.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    const usuarios = await Usuario.find(filtros)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Usuario.countDocuments(filtros);
    
    res.status(200).json({
      success: true,
      data: usuarios,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

// READ - Obtener un usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

// UPDATE - Actualizar un usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizaciones = req.body;
    
    // Evitar actualizar campos sensibles
    delete actualizaciones._id;
    delete actualizaciones.createdAt;
    delete actualizaciones.updatedAt;
    
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      actualizaciones,
      { 
        new: true, // Retorna el documento actualizado
        runValidators: true // Ejecuta las validaciones del schema
      }
    );
    
    if (!usuarioActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: usuarioActualizado
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado',
        error: 'Email duplicado'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errores
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

// DELETE - Eliminar un usuario (soft delete)
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Soft delete - marcar como inactivo en lugar de eliminar
    const usuarioEliminado = await Usuario.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );
    
    if (!usuarioEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente (desactivado)',
      data: usuarioEliminado
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};

// DELETE - Eliminar permanentemente un usuario
export const eliminarUsuarioPermanente = async (req, res) => {
  try {
    const { id } = req.params;
    
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);
    
    if (!usuarioEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Usuario eliminado permanentemente',
      data: usuarioEliminado
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario permanentemente',
      error: error.message
    });
  }
};

// UTILITY - Reactivar un usuario
export const reactivarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const usuarioReactivado = await Usuario.findByIdAndUpdate(
      id,
      { activo: true },
      { new: true }
    );
    
    if (!usuarioReactivado) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Usuario reactivado exitosamente',
      data: usuarioReactivado
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al reactivar usuario',
      error: error.message
    });
  }
};