/**
 * Create Initial Admin User
 *
 * This script creates the first admin user for the system.
 * Run this AFTER migrations 001 and 002 have been applied.
 *
 * Usage:
 *   node database/migrations/003_create_initial_admin.js
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createInitialAdmin() {
  let connection;

  try {
    // Get database connection details
    console.log('\n=== CREATE INITIAL ADMIN USER ===\n');

    const dbHost = process.env.DB_HOST || await question('Database Host (default: localhost): ') || 'localhost';
    const dbUser = process.env.DB_USER || await question('Database User (default: root): ') || 'root';
    const dbPassword = process.env.DB_PASSWORD || await question('Database Password: ');
    const dbName = process.env.DB_NAME || await question('Database Name (default: me_clickup_system): ') || 'me_clickup_system';

    // Get admin user details
    console.log('\n--- Admin User Details ---\n');
    const username = await question('Admin Username (default: admin): ') || 'admin';
    const email = await question('Admin Email (default: admin@caritas.org): ') || 'admin@caritas.org';
    const fullName = await question('Full Name (default: System Administrator): ') || 'System Administrator';
    const password = await question('Admin Password (minimum 8 characters): ');

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    console.log('\nConnecting to database...');

    // Create connection
    connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName
    });

    console.log('Connected successfully!\n');

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id, username, email FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      console.log('⚠️  User already exists:');
      console.log('   Username:', existingUsers[0].username);
      console.log('   Email:', existingUsers[0].email);
      console.log('   ID:', existingUsers[0].id);

      const update = await question('\nDo you want to update this user to admin? (yes/no): ');

      if (update.toLowerCase() !== 'yes' && update.toLowerCase() !== 'y') {
        console.log('\nOperation cancelled.');
        rl.close();
        await connection.end();
        return;
      }

      const userId = existingUsers[0].id;

      // Hash the new password
      const passwordHash = await bcrypt.hash(password, 10);

      // Update user
      await connection.execute(
        `UPDATE users
         SET password_hash = ?,
             full_name = ?,
             is_system_admin = true,
             is_active = true,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [passwordHash, fullName, userId]
      );

      // Get system_admin role
      const [roles] = await connection.execute(
        "SELECT id FROM roles WHERE name = 'system_admin'"
      );

      if (roles.length === 0) {
        throw new Error('system_admin role not found. Please run migration 002 first.');
      }

      const roleId = roles[0].id;

      // Check if role assignment exists
      const [existingRole] = await connection.execute(
        'SELECT id FROM user_roles WHERE user_id = ? AND role_id = ?',
        [userId, roleId]
      );

      if (existingRole.length === 0) {
        // Assign system_admin role
        await connection.execute(
          'INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at) VALUES (?, ?, ?, NOW())',
          [userId, roleId, userId]
        );
      }

      console.log('\n✅ User updated successfully!');
      console.log('   ID:', userId);
      console.log('   Username:', username);
      console.log('   Email:', email);
      console.log('   Role: System Administrator');
      console.log('   System Admin: Yes');

    } else {
      // Create new user
      console.log('Creating new admin user...');

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Insert user
      const [result] = await connection.execute(
        `INSERT INTO users
         (username, email, password_hash, full_name, role, is_system_admin, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'admin', true, true, NOW(), NOW())`,
        [username, email, passwordHash, fullName]
      );

      const userId = result.insertId;

      // Get system_admin role
      const [roles] = await connection.execute(
        "SELECT id FROM roles WHERE name = 'system_admin'"
      );

      if (roles.length === 0) {
        throw new Error('system_admin role not found. Please run migration 002 first.');
      }

      const roleId = roles[0].id;

      // Assign system_admin role
      await connection.execute(
        'INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at) VALUES (?, ?, ?, NOW())',
        [userId, roleId, userId]
      );

      console.log('\n✅ Admin user created successfully!');
      console.log('   ID:', userId);
      console.log('   Username:', username);
      console.log('   Email:', email);
      console.log('   Role: System Administrator');
      console.log('   System Admin: Yes');
    }

    console.log('\n✅ Setup complete! You can now login with these credentials.');
    console.log('\nNext steps:');
    console.log('1. Start the backend server: cd backend && npm start');
    console.log('2. Start the frontend: cd frontend && npm start');
    console.log('3. Navigate to http://localhost:5173/login');
    console.log('4. Login with your admin credentials\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
createInitialAdmin();
