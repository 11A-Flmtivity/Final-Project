import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const getLoginPage = (req, res) => {
    res.render('pages/login', { title: 'Login' });
};

export const getRegisterPage = (req, res) => {
    res.render('pages/register', { title: 'Register' });
};

export const postRegister = async (req, res) => {
    const { username, email, password, rePassword } = req.body;

    if (password !== rePassword) {
        return res.render('pages/register', { error: 'Passwords do not match.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await User.create({ username, email, password: hashedPassword });
        res.redirect('/auth/login');
    } catch (error) {
        // Handle existing user error, etc.
        res.render('pages/register', { error: 'Failed to register user. Email may already be in use.' });
    }
};

export const postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('pages/login', { error: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('pages/login', { error: 'Invalid credentials.' });
        }

        const token = jwt.sign({ _id: user._id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('auth_token', token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        res.render('pages/login', { error: 'An error occurred.' });
    }
};

export const logout = (req, res) => {
    res.clearCookie('auth_token');
    res.redirect('/');
};