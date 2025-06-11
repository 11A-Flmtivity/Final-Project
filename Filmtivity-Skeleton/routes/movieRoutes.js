import { Router } from 'express';
import { getAllMovies, getMovieDetails, addComment } from '../controllers/movieController.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getAllMovies);
router.get('/:id', getMovieDetails);

// Only authenticated users can post comments
router.post('/:id/comment', isAuth, addComment);

export default router;
