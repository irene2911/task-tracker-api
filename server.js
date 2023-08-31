import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import boardRoutes from './routes/boardRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import moveTaskRoutes from './routes/moveTaskRoutes.js';

dotenv.config();
const app = express();
const port = 3000;

app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:5173',
};

app.options('*', cors());

app.use(cors(corsOptions));

app.use('/', moveTaskRoutes);
app.use('/boards', boardRoutes);
app.use('/', itemRoutes);

app.listen(port, () => {
  mongoose.connect(process.env.MONGODB_URL);
  console.log(`Server is running on port ${port}`);
});
