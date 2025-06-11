import express from 'express';
import { create } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { authMiddleware } from './middlewares/authMiddleware.js';

// Import routers
import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

const hbs = create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: join(__dirname, 'views/layouts'),
    partialsDir: join(__dirname, 'views/partials'),
    helpers: {
        formatDate: (date) => {
            return new Date(date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use('/src', express.static(join(__dirname, 'src')));

// --- Use Routers ---
app.get('/', (req, res) => {
    res.render('pages/home', { title: 'Home' });
});

app.use('/movies', movieRoutes);
app.use('/auth', authRoutes);


// 404 Handler, this should be last
app.use((req, res) => {
    res.status(404).render('pages/404', { title: 'Page Not Found' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
