#!/usr/bin/env node

/**
 * Database Connection Test Script
 * 
 * This script tests the MongoDB connection and verifies:
 * - Connection to MongoDB is successful
 * - Database is accessible
 * - Basic CRUD operations work
 */

import { connectDatabase, disconnectDatabase } from './config/database';
import mongoose from 'mongoose';

// Simple test schema
const TestSchema = new mongoose.Schema({
  name: String,
  timestamp: Date,
});

const TestModel = mongoose.model('Test', TestSchema);

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');

  try {
    // Step 1: Connect to database
    console.log('1️⃣  Connecting to MongoDB...');
    await connectDatabase();

    // Step 2: Test write operation
    console.log('\n2️⃣  Testing write operation...');
    const testDoc = new TestModel({
      name: 'test-connection',
      timestamp: new Date(),
    });
    await testDoc.save();
    console.log('✅ Write operation successful');

    // Step 3: Test read operation
    console.log('\n3️⃣  Testing read operation...');
    const found = await TestModel.findOne({ name: 'test-connection' });
    if (found) {
      console.log('✅ Read operation successful');
      console.log(`   Document ID: ${found._id}`);
    }

    // Step 4: Test delete operation
    console.log('\n4️⃣  Testing delete operation...');
    await TestModel.deleteOne({ name: 'test-connection' });
    console.log('✅ Delete operation successful');

    // Step 5: Verify connection details
    console.log('\n5️⃣  Connection details:');
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Ready State: ${mongoose.connection.readyState} (1 = connected)`);

    console.log('\n✅ All database tests passed!\n');

  } catch (error) {
    console.error('\n❌ Database test failed:', error);
    process.exit(1);
  } finally {
    // Disconnect
    await disconnectDatabase();
  }
}

// Run the test
testDatabaseConnection();
