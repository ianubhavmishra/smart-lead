import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import leadRoutes from './routes/leadRoutes.js';
import { startCronJob } from './services/cronService.js';

dotenv.config();
const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.use('/api/leads', leadRoutes);

app.get('/', (req, res) => {
    res.send('Smart Lead API is running.');
});

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        startCronJob();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
