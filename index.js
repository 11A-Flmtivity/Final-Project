import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { engine } from 'express-handlebars'

import connectDB from './config/db.js'

dotenv.config();

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Handlebars setup
app.engine('handlebars', engine({
    extname: `.hbs`,
    defaultLayout: `main`,
    layoutsDir: join(_dirname, `views/layouts`),
    partialsDir: join(_dirname, `views/partials`)
}));
app.set('view engine', 'handlebars');
app.set('views', join(_dirname, 'views'));

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(join(_dirname, 'static')));


app.use(`/src`, express.static(join(_dirname, `src`)));

app.get('/', (req, res) => {
    res.render('pages/home', {
        title: `Home`,
        additonalStyles: [`home`]
    });
});

app.get('/', (req, res) => {
    res.status(404).render('pages/404', {
        title: `Page Not Found`,
        additonalStyles: [`404`]
    });
});

app.listen(PORT, () => {
    console.log('Server is started on http://localhost:' + PORT);
});