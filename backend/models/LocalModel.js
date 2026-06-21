import { readJSON, writeJSON } from '../config/db.js';

export class LocalModel {
  constructor(collectionName) {
    this.collection = collectionName;
  }

  async find(filter = {}) {
    const data = readJSON(this.collection);
    return data.filter(item => {
      for (let key in filter) {
        if (filter[key] !== undefined) {
          // Check if string contains or matches exactly
          if (typeof filter[key] === 'string' && typeof item[key] === 'string') {
            if (filter[key].startsWith('/') && filter[key].endsWith('/i')) {
              // Simulating regex
              const val = filter[key].slice(1, -2);
              const regex = new RegExp(val, 'i');
              return regex.test(item[key]);
            }
          }
          if (item[key] !== filter[key]) {
            return false;
          }
        }
      }
      return true;
    });
  }

  async findOne(filter = {}) {
    const data = readJSON(this.collection);
    return data.find(item => {
      for (let key in filter) {
        if (filter[key] !== undefined) {
          if (item[key] !== filter[key]) {
            return false;
          }
        }
      }
      return true;
    }) || null;
  }

  async findById(id) {
    const data = readJSON(this.collection);
    return data.find(item => item._id === id || item.id === id) || null;
  }

  async create(doc) {
    const data = readJSON(this.collection);
    const newDoc = {
      _id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    data.push(newDoc);
    writeJSON(this.collection, data);
    return newDoc;
  }

  async findByIdAndUpdate(id, updates, options = { new: true }) {
    const data = readJSON(this.collection);
    const index = data.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeJSON(this.collection, data);
    return data[index];
  }

  async findOneAndUpdate(filter, updates, options = { new: true }) {
    const data = readJSON(this.collection);
    const index = data.findIndex(item => {
      for (let key in filter) {
        if (filter[key] !== undefined && item[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    });
    if (index === -1) return null;
    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeJSON(this.collection, data);
    return data[index];
  }

  async deleteOne(filter = {}) {
    let data = readJSON(this.collection);
    const initialLen = data.length;
    
    if (Object.keys(filter).length === 0) {
      // If empty query, remove first item or clear depending on preference. Mongoose deleteOne({}) deletes the first matched item.
      if (data.length > 0) {
        data.shift();
        writeJSON(this.collection, data);
        return { deletedCount: 1 };
      }
      return { deletedCount: 0 };
    }

    let deleted = false;
    data = data.filter(item => {
      if (deleted) return true;
      for (let key in filter) {
        if (filter[key] !== undefined && item[key] !== filter[key]) {
          return true; // Keep
        }
      }
      deleted = true;
      return false; // Remove first match
    });
    writeJSON(this.collection, data);
    return { deletedCount: deleted ? 1 : 0 };
  }

  async deleteMany(filter = {}) {
    let data = readJSON(this.collection);
    const initialLen = data.length;

    if (Object.keys(filter).length === 0) {
      writeJSON(this.collection, []);
      return { deletedCount: initialLen };
    }

    data = data.filter(item => {
      for (let key in filter) {
        if (filter[key] !== undefined && item[key] === filter[key]) {
          return false; // Remove all matches
        }
      }
      return true; // Keep
    });
    writeJSON(this.collection, data);
    return { deletedCount: initialLen - data.length };
  }
}
