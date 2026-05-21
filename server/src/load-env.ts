/**
 * Load server/.env before any other app modules (import hoisting runs before
 * dotenv.config() in index.ts otherwise).
 */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });
