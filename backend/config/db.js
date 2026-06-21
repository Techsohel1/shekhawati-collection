import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let isMongo = false;
const DATA_DIR = path.join(__dirname, '..', 'data');

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  
  if (mongoUri) {
    try {
      console.log('Attempting to connect to MongoDB...');
      await mongoose.connect(mongoUri);
      isMongo = true;
      console.log('MongoDB Connected Successfully.');
      return;
    } catch (err) {
      console.error(`MongoDB Connection Error: ${err.message}`);
      console.log('Falling back to Local JSON Database...');
    }
  } else {
    console.log('No MONGODB_URI found in environment variables.');
    console.log('Using Local JSON Database Fallback...');
  }
  
  // Initialize JSON database files if they don't exist
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  const collections = ['users', 'products', 'orders', 'reviews', 'coupons'];
  collections.forEach((col) => {
    const filePath = path.join(DATA_DIR, `${col}.json`);
    if (!fs.existsSync(filePath)) {
      // Seed with empty array
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      console.log(`Initialized empty local DB file: ${col}.json`);
    }
  });
  
  isMongo = false;
};

// JSON Local Database Helpers
export const readJSON = (collection) => {
  try {
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error(`Error reading ${collection}.json:`, error);
    return [];
  }
};

export const writeJSON = (collection, data) => {
  try {
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing to ${collection}.json:`, error);
    return false;
  }
};
