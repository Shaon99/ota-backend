const { PrismaClient } = require('@prisma/client');

// Singleton pattern for Prisma client
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
    
    Database.instance = this;
  }

  async connect() {
    try {
      await this.prisma.$connect();
      console.log('✅ Database connected successfully');
      
      // Test the connection with a simple query
      await this.prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connection verified');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      console.error('❌ Please check your DATABASE_URL and ensure the server is accessible');
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