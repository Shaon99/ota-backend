const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class AuthService {
  /**
   * Hash password
   */
  static async hashPassword(password) {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    return await bcrypt.hash(password, rounds);
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   */
  static generateToken(payload) {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    return jwt.sign(payload, secret, { expiresIn });
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token) {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    return jwt.verify(token, secret);
  }

  /**
   * Find admin by email
   */
  static async findAdminByEmail(email) {
    return await prisma.admin.findUnique({
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
  static async findAdminById(id) {
    return await prisma.admin.findUnique({
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
   * Authenticate admin (validation should be done before calling this)
   */
  static async authenticateAdmin(email, password) {
    // Find admin
    const admin = await this.findAdminByEmail(email);
    if (!admin) {
      throw new Error('Invalid credentials');
    }

    if (!admin.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(password, admin.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  }

  /**
   * Generate auth response
   */
  static generateAuthResponse(admin) {
    const token = this.generateToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role
    });

    return {
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    };
  }
}

module.exports = AuthService;