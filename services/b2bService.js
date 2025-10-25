const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class B2BService {
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
    const expiresIn = process.env.JWT_EXPIRES_IN || "24h";

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(payload, secret, { expiresIn });
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }
    return jwt.verify(token, secret);
  }

  /**
   * Find B2B customer by email (excluding soft-deleted)
   */
  static async findB2BCustomerByEmail(email) {
    return await prisma.b2BCustomer.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  /**
   * Find B2B customer by phone (excluding soft-deleted)
   */
  static async findB2BCustomerByPhone(phone) {
    return await prisma.b2BCustomer.findFirst({
      where: {
        phone,
        deletedAt: null,
      },
    });
  }

  /**
   * Find B2B customer by ID (excluding soft-deleted)
   */
  static async findB2BCustomerById(id) {
    return await prisma.b2BCustomer.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  /**
   * Create B2B customer
   */
  static async createB2BCustomer(customerData) {
    const {
      name,
      email,
      phone,
      isActive,
      password,
      city,
      thana,
      address,
      c_name,
      business_email,
      c_phone_number,
      c_email,
      trade_license,
      civil_aviation_certificate,
      national_id_front,
      national_id_back,
      address_proof,
      heard_about,
    } = customerData;

    // Validate document fields - reject empty objects
    const documentFields = [
      "trade_license",
      "civil_aviation_certificate",
      "national_id_front",
      "national_id_back",
      "address_proof",
    ];

    for (const field of documentFields) {
      if (
        customerData[field] &&
        typeof customerData[field] === "object" &&
        Object.keys(customerData[field]).length === 0
      ) {
        throw new Error(
          `${field} cannot be an empty object. Please provide a valid string or omit this field.`
        );
      }
    }

    // Check if customer already exists
    const existingEmail = await this.findB2BCustomerByEmail(email);
    if (existingEmail) {
      throw new Error("B2B customer with this email already exists");
    }

    // Check if customer already exists
    const existingPhone = await this.findB2BCustomerByPhone(phone);
    if (existingPhone) {
      throw new Error("B2B customer with this phone number already exists");
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create customer
    const customer = await prisma.b2BCustomer.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "b2b_admin",
        isActive,
        // Personal Information
        city: city || null,
        thana: thana || null,
        address: address || null,
        // Company Information
        c_name: c_name || null,
        business_email: business_email || null,
        c_phone_number: c_phone_number || null,
        c_email: c_email || null,
        // Documents (Optional)
        trade_license: trade_license || null,
        civil_aviation_certificate: civil_aviation_certificate || null,
        national_id_front: national_id_front || null,
        national_id_back: national_id_back || null,
        address_proof: address_proof || null,
        // Additional Information
        heard_about: heard_about || null,
      },
    });

    // Return customer without password
    const { password: _, ...customerWithoutPassword } = customer;
    return customerWithoutPassword;
  }

  /**
   * Get all B2B customers with pagination
   */
  static async getAllB2BCustomers(page = 1, limit = 10, search = "") {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search } },
          ],
          deletedAt: null,
        }
      : { deletedAt: null };

    const [customers, total] = await Promise.all([
      prisma.b2BCustomer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.b2BCustomer.count({ where }),
    ]);

    return {
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get B2B customer by ID (excluding soft-deleted)
   */
  static async getB2BCustomerById(id) {
    const customer = await prisma.b2BCustomer.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        city: true,
        thana: true,
        address: true,
        c_name: true,
        business_email: true,
        c_phone_number: true,
        c_email: true,
        trade_license: true,
        civil_aviation_certificate: true,
        heard_about: true,
        address_proof: true,
        national_id_back: true,
        national_id_front: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!customer) {
      throw new Error("B2B customer not found");
    }

    return customer;
  }

  /**
   * Update B2B customer
   * Note: Password updates are intentionally not allowed here for security reasons.
   * Password should only be updated via the dedicated updateB2BCustomerPassword method.
   */
  static async updateB2BCustomer(id, updateData) {
    // Check if customer exists
    const existingCustomer = await this.findB2BCustomerById(id);
    if (!existingCustomer) {
      throw new Error("B2B customer not found");
    }

    // Prevent password update through this method
    if ("password" in updateData) {
      delete updateData.password;
    }

    // Check if email is being updated and if it's already taken
    if (updateData.email && updateData.email !== existingCustomer.email) {
      const emailExists = await this.findB2BCustomerByEmail(updateData.email);
      if (emailExists) {
        throw new Error("Email already exists");
      }
    }

    // Check if phone is being updated and if it's already taken
    if (updateData.phone && updateData.phone !== existingCustomer.phone) {
      const phoneExists = await this.findB2BCustomerByPhone(updateData.phone);
      if (phoneExists) {
        throw new Error("Phone number already exists");
      }
    }

    const updatedCustomer = await prisma.b2BCustomer.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedCustomer;
  }

  /**
   * Update B2B customer password
   */
  static async updateB2BCustomerPassword(id, currentPassword, newPassword) {
    // Find customer
    const customer = await prisma.b2BCustomer.findUnique({ where: { id } });
    if (!customer) {
      throw new Error("B2B customer not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await this.comparePassword(
      currentPassword,
      customer.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedNewPassword = await this.hashPassword(newPassword);

    // Update password
    await prisma.b2BCustomer.update({
      where: { id },
      data: { password: hashedNewPassword },
    });

    return { message: "Password updated successfully" };
  }

  /**
   * Update B2B customer status
   */
  static async updateB2BCustomerStatus(id, isActive) {
    const customer = await prisma.b2BCustomer.findUnique({ where: { id } });
    if (!customer) {
      throw new Error("B2B customer not found");
    }

    const updatedCustomer = await prisma.b2BCustomer.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedCustomer;
  }

  /**
   * Delete B2B customer (soft delete)
   */
  static async deleteB2BCustomer(id) {
    const customer = await prisma.b2BCustomer.findUnique({ where: { id } });
    if (!customer) {
      throw new Error("B2B customer not found");
    }

    await prisma.b2BCustomer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: "B2B customer deleted successfully" };
  }

  /**
   * Authenticate B2B customer
   */
  static async authenticateB2BCustomer(email, password) {
    // Find customer (excluding soft-deleted)
    const customer = await this.findB2BCustomerByEmail(email);
    if (!customer) {
      throw new Error("Invalid credentials");
    }

    // Check if customer is active
    if (!customer.isActive) {
      throw new Error("Account is deactivated");
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(
      password,
      customer.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    return customer;
  }

  /**
   * Generate authentication response
   */
  static generateAuthResponse(customer) {
    const token = this.generateToken({
      id: customer.id,
      email: customer.email,
      role: customer.role,
    });

    return {
      token,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: customer.role,
        isActive: customer.isActive,
      },
    };
  }
}

module.exports = B2BService;