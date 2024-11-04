import * as dotenv from 'dotenv';
import app from './server.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

// Connect to the database and then start the server
if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server listening on port: http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to connect to the database:', error);
      process.exit(1);
    });
}
