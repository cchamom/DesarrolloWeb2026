import { Router } from 'express';
import { asyncHandler } from '../middlewares/errores.js';
import { validarEstudiante, revisarErrores } from '../validators/estudianteValidator.js';

export function estudiantesRoutes(repo) {
  const router = Router();

  router.get('/', asyncHandler(async (req, res) => {
    res.json(await repo.listar());
  }));

  router.get('/:id', asyncHandler(async (req, res) => {
    const estudiante = await repo.obtener(req.params.id);
    if (!estudiante) return res.status(404).json({ error: 'No encontrado' });
    res.json(estudiante);
  }));

  router.post('/', validarEstudiante, revisarErrores,
    asyncHandler(async (req, res) => {
      const estudiante = await repo.crear(req.body);
      res.status(201).json(estudiante);
    }));

  return router;
}