import express from 'express';
import dotenv from 'dotenv';
import { startSessionCleaner } from './utils/cron_job.js';
import authRouter from './auth/auth-router.js';
import registerRouter from './member-registration/registeration-router.js';

const app = express();

dotenv.config();

app.use(express.json());

startSessionCleaner();

//port configuration
const PORT = process.env.PORT || 3000;

//error handling middleware
app.use((err, req, res, next) => {
  // console.error(err.stack);
  res.status(500).send('Something broke!');
});

//auth routes
app.use("/api/users",authRouter);

//members registration routes
app.use("/api/members", registerRouter);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});