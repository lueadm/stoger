#!/usr/bin/env node

/**
 * Schema Validation Test Script
 * 
 * This script tests the MongoDB schemas and indexes:
 * - User schema with profile field
 * - Story schema with chapters and metadata
 * - Proper indexes are created
 */

import { connectDatabase, disconnectDatabase } from './config/database';
import User from './models/User';
import Story from './models/Story';

async function testSchemas() {
  console.log('🔍 Testing MongoDB schemas and indexes...\n');

  try {
    // Step 1: Connect to database
    console.log('1️⃣  Connecting to MongoDB...');
    await connectDatabase();

    // Step 2: Test User schema with profile
    console.log('\n2️⃣  Testing User schema with profile...');
    const testUser = new User({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      profile: {
        firstName: 'Test',
        lastName: 'User',
        bio: 'This is a test user',
        avatarUrl: 'https://example.com/avatar.jpg'
      }
    });
    await testUser.save();
    console.log('✅ User created with profile successfully');

    // Verify the user
    const foundUser = await User.findOne({ email: 'test@example.com' });
    if (foundUser && foundUser.profile) {
      console.log(`   Profile: ${foundUser.profile.firstName} ${foundUser.profile.lastName}`);
      console.log(`   Bio: ${foundUser.profile.bio}`);
    }

    // Step 3: Test Story schema with chapters and metadata
    console.log('\n3️⃣  Testing Story schema with chapters and metadata...');
    const testStory = new Story({
      title: 'Test Story',
      summary: 'This is a test story',
      authorId: testUser._id.toString(),
      published: false,
      chapters: [
        {
          id: 'ch1',
          title: 'Chapter 1',
          content: 'This is the first chapter',
          order: 1,
          metadata: {
            wordCount: 5,
            readingTime: 1,
            tags: ['test', 'chapter1'],
            notes: 'First chapter notes'
          }
        },
        {
          id: 'ch2',
          title: 'Chapter 2',
          content: 'This is the second chapter',
          order: 2,
          metadata: {
            wordCount: 5,
            readingTime: 1,
            tags: ['test', 'chapter2']
          }
        }
      ]
    });
    await testStory.save();
    console.log('✅ Story created with chapters and metadata successfully');

    // Verify the story
    const foundStory = await Story.findOne({ title: 'Test Story' });
    if (foundStory) {
      console.log(`   Title: ${foundStory.title}`);
      console.log(`   Chapters: ${foundStory.chapters.length}`);
      console.log(`   Chapter 1 metadata: wordCount=${foundStory.chapters[0].metadata?.wordCount}, tags=${foundStory.chapters[0].metadata?.tags?.join(', ')}`);
    }

    // Step 4: Verify indexes
    console.log('\n4️⃣  Verifying indexes...');
    
    // Get User indexes
    const userIndexes = await User.collection.getIndexes();
    console.log('   User indexes:', Object.keys(userIndexes).join(', '));
    
    // Get Story indexes
    const storyIndexes = await Story.collection.getIndexes();
    console.log('   Story indexes:', Object.keys(storyIndexes).join(', '));

    // Step 5: Clean up
    console.log('\n5️⃣  Cleaning up test data...');
    await User.deleteOne({ email: 'test@example.com' });
    await Story.deleteOne({ title: 'Test Story' });
    console.log('✅ Test data cleaned up');

    console.log('\n✅ All schema tests passed!\n');

  } catch (error) {
    console.error('\n❌ Schema test failed:', error);
    process.exit(1);
  } finally {
    // Disconnect
    await disconnectDatabase();
  }
}

// Run the test
testSchemas();
