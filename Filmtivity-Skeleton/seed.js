import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Movie from './models/Movie.js';
import Comment from './models/Comment.js';

dotenv.config();

async function seedDatabase() {
    try {
        // Свързване с базата
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Изтриване на съществуващи данни
        await User.deleteMany({});
        await Movie.deleteMany({});
        await Comment.deleteMany({});
        console.log('Cleared existing data');

        // Създаване на тестов потребител
        const testUser = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('Created test user:', testUser.username);

        // Създаване на тестови филми
        const movies = await Movie.create([
            {
                title: 'The Shawshank Redemption',
                movieId: '278',
                poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
                overview: 'Two imprisoned men bond over a number of years...',
                release_date: '1994-09-23',
                vote_average: 8.7,
                original_language: 'en',
                savedBy: [testUser._id]
            },
            {
                title: 'The Godfather',
                movieId: '238',
                poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
                overview: 'The aging patriarch of an organized crime dynasty...',
                release_date: '1972-03-24',
                vote_average: 8.7,
                original_language: 'en',
                savedBy: []
            }
        ]);
        console.log(`Created ${movies.length} test movies`);

        // Вземаме първия филм за да добавим коментар
        const firstMovie = movies[0];

        // Добавяне на филми към любимите на потребителя
        testUser.favorites = [firstMovie._id];
        await testUser.save();
        console.log('Updated user favorites');

        // Създаване на тестов коментар
        const testComment = await Comment.create({
            text: 'A truly moving film. One of the best ever made.',
            author: testUser._id,
            movie: firstMovie._id
        });
        console.log('Created a test comment');

        // Добавяне на коментара към филма
        firstMovie.comments.push(testComment._id);
        await firstMovie.save();
        console.log('Added comment to movie');

        console.log('\n Database seeded successfully!');
        console.log('You should now see the "filmtivity" database in MongoDB Compass');

        // Показване на статистика
        const userCount = await User.countDocuments();
        const movieCount = await Movie.countDocuments();
        const commentCount = await Comment.countDocuments();
        console.log(`\nDatabase statistics:`);
        console.log(`- Users: ${userCount}`);
        console.log(`- Movies: ${movieCount}`);
        console.log(`- Comments: ${commentCount}`);

        // Затваряне на връзката
        await mongoose.connection.close();
        console.log('\nConnection closed');

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Стартиране
seedDatabase();