import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import predictRoutes from './routes/predictRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import jobRoutes from './routes/jobRoutes.js';   // ✅ FIXED (added import)

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/jobs', jobRoutes); // ✅ FIXED (no require anymore)

app.get('/', (_, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));