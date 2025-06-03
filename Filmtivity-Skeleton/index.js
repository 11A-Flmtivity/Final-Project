import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';
import {engine} from 'express-handlebars';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

app.engine(".hbs", engine({
    extname: ".hbs",
    //defaultLayout: "main",
    layoutsDir: join(__dirname, "views/layouts"),
    partialsDir: join(__dirname, "views/partials"),
}));
app.set("view engine", "hbs");
app.set("views", join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(join(__dirname, "static")));

app.use('/src', express.static(join(__dirname, 'src')));

app.get("/", (req, res) => {
    res.render('pages/home', {
        title: 'Home',
        additionalStyles: ['home']
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