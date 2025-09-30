const { PrismaClient } = require('@prisma/client');

class AdminModel {
  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Find admin by email
   */
  async findByEmail(email) {
    return await this.prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  /**
   * Find admin by ID
   */
  async findById(id) {
    return await this.prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  /**
   * Create new admin
   */
  async create(data) {
    return await this.prisma.admin.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  /**
   * Update admin
   */
  async update(id, data) {
    return await this.prisma.admin.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  /**
   * Delete admin (soft delete by setting isActive to false)
   */
  async softDelete(id) {
    return await this.prisma.admin.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  /**
   * Get all admins with pagination
   */
  async findAll(options = {}) {
    const { page = 1, limit = 10, role, isActive } = options;
    const skip = (page - 1) * limit;

    const where = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;

    const [admins, total] = await Promise.all([
      this.prisma.admin.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.admin.count({ where })
    ]);

    return {
      admins,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Check if email exists
   */
  async emailExists(email, excludeId = null) {
    const where = { email };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    
    const admin = await this.prisma.admin.findFirst({ where });
    return !!admin;
  }

  /**
   * Close database connection
   */
  async disconnect() {
    await this.prisma.$disconnect();
  }
}

module.exports = AdminModel;
