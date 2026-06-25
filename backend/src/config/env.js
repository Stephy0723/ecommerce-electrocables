import dotenv from 'dotenv';
dotenv.config();
export const env = { PORT: process.env.PORT || 4000, NODE_ENV: process.env.NODE_ENV || 'development', DATABASE_URL: process.env.DATABASE_URL || null, JWT_SECRET: process.env.JWT_SECRET || 'dev-secret' };
