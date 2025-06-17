import express from 'express';
import { rateMovie } from '../controllers/movieController.js';

const router = express.Router();

router.post('/movies/:id/rate', rateMovie);

export default router;