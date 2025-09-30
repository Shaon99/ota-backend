const { PrismaClient } = require('@prisma/client');

// Singleton pattern for Prisma client
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
    });
    
    Database.instance = this;
  }

  async connect() {
    try {
      await this.prisma.$connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.prisma.$disconnect();
      console.log('✅ Database disconnected successfully');
    } catch (error) {
      console.error('❌ Database disconnection failed:', error.message);
      throw error;
    }
  }

  getClient() {
    return this.prisma;
  }
}

module.exports = new Database();