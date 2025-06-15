import Movie from '../models/Movie.js';
import Comment from '../models/Comment.js'; // Add this import

export const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find().lean();
        res.render('pages/all-movies', { title: 'All Movies', movies });
    } catch (error) {
        res.render('pages/404', { title: 'Error', error: 'Could not fetch movies.' });
    }
};

export const getMovieDetails = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username' },
                options: { sort: { 'createdAt': -1 } }
            })
            .lean();
        
        if (!movie) {
            return res.render('pages/404', { title: 'Movie Not Found' });
        }
        
        // Check if the current user is the owner/creator of the movie if needed
        // const isOwner = req.user && req.user._id == movie.owner;
        
        res.render('pages/details', { title: movie.title, movie });
    } catch (error) {
        console.error(error); // Log the actual error for debugging
        res.render('pages/404', { title: 'Error', error: 'Could not fetch movie details.' });
    }
};

export const addComment = async (req, res) => {
    const userId = req.user._id; 
    const movieId = req.params.id;
    const { text } = req.body;

    try {
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        const comment = await Comment.create({
            text,
            author: userId,
            movie: movieId,
        });

        movie.comments.push(comment._id);
        await movie.save();
        res.redirect(`/movies/${movieId}`);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.redirect(`/movies/${movieId}`);
    }
};