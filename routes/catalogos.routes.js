import express from 'express';
import { CATALOGOS } from '../utils/catalogos.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json(CATALOGOS);
});

export default router;
