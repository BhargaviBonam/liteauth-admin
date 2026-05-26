import app from './app';
import { seedDatabase } from './database/seed';

// Initialize DB and seed
import './database/db';
seedDatabase();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`LiteAuth server running at http://localhost:${PORT}`);
});
