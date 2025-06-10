import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';
import {engine} from 'express-handlebars';
import connectDB from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.engine(".hbs", engine({
    extname: ".hbs",
    //defaultLayout: "main",
    layoutsDir: join(__dirname, "views/layouts"),
    partialsDir: join(__dirname, "views/partials"),
    helpers: {
    eq: (a, b) => a === b
 },
}));
app.set("view engine", "hbs");
app.set("views", join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(join(__dirname, "static")));

app.use('/src', express.static(join(__dirname, 'src')));

app.checkAuthMiddleware = (req, res, next) => {
     const token = req.cookies.authToken;

    // If no token is found, redirect to login
    if (!token) {
        return res.redirect('/login');
    }

    // verification
    try{
        // where the error could occur
        const user = jwt.verify(token, process.env.JWT_SECRET);

        // adds the user info to the res 
        // for easier access in the routes
        req.user = user;
        next();
    } catch (error) {
        console.error("JWT verification failed:", error);

        // clears the cookie for convinience 
        res.clearCookie('authToken');
        return res.redirect('/login');
    }
}

app.use((req, res, next) => {
    const token = req.cookies.authToken;

    if (token) {
        try {
            // potential error, hence the try catch block
            const user = jwt.verify(token, process.env.JWT_SECRET);

            // setting the parameter for the views to accsess
            res.locals.user = user;
        } catch (err) {
            // standart error output
            console.error('Invalid token:', err);

            // clear the cookie if the token is invalid
            res.locals.user = null;
        }
    } else {
        // if no token is found, set user to null
        console.log('No token found');
        res.locals.user = null;
    }

    next();
});

app.get("/", (req, res) => {
    res.render('pages/home', {
        title: 'Home',
        additionalStyles: ['home'],
        isLoggedIn: req.cookies.authToken ? true : false,
    });
});

app.use((req, res) => {
    res.status(404).render('pages/404', {
        title: 'Page Not Found',
        additionalStyles: ['error']
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});