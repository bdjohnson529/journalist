import express from 'express';
import { Pool } from 'pg';
import { TranscriptionSubmission } from '../src/services/api';
import cors from 'cors';

const pool = new Pool({
  user: 'your_user',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

const app = express();
app.use(express.json());

// Configure CORS to only allow requests from your frontend domain
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app']
    : ['http://localhost:3000']
}));

app.post('/api/transcriptions', async (req, res) => {
  const submission: TranscriptionSubmission = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO transcriptions (content, original_files, created_at) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [submission.content, submission.originalFiles, submission.createdAt]
    );
    
    res.json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Error saving transcription:', error);
    res.status(500).json({ error: 'Failed to save transcription' });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
}); 