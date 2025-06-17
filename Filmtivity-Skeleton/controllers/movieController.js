import Movie from '../models/Movie.js';

export const rateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const rating = Number(req.body.rating);

    if (rating < 1 || rating > 5) {
      return res.status(400).send('Invalid rating');
    }

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).send('Movie not found');

    movie.ratings.push(rating);
    await movie.save();

    res.redirect(`/movies/${movieId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};