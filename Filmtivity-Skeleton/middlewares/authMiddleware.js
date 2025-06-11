import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedToken;
            res.locals.isAuth = true;
        } catch (err) {
            res.clearCookie('auth_token');
            res.locals.isAuth = false;
        }
    } else {
        res.locals.isAuth = false;
    }
    next();
};

// Middleware to protect routes that require a logged-in user
export const isAuth = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).redirect('/auth/login');
    }
};