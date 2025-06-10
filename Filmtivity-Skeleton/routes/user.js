import express from 'express';
import User from '../models/User';

const router = express.Router();

// Optional: authentication middleware
function isAuthenticated(req, res, next) {
    if (!req.session.user) return res.redirect('/login');
    next();
}

router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId).populate('favoriteMovies');

        res.render('pages/profile', {
            user: {
                email: user.email,
                registrationDate: user.createdAt.toDateString(),
                favoriteCount: user.favoriteMovies.length
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


module.exports = router;