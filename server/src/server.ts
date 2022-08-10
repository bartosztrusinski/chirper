import * as dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
