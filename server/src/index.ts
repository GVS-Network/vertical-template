/// <reference path="./types/express.d.ts" />
import './load-env';

import { connectDatabase } from './config/database';
import { createApp } from './app';
import { primeBoundSiteConfig } from './seams/bound-site-config';

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await connectDatabase();
    await primeBoundSiteConfig();

    const app = await createApp();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API available at http://localhost:${PORT}/api`);
      console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
