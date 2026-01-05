// MongoDB initialization script
// This script creates a default public conversation when the database starts

db = db.getSiblingDB('whatsapp');

// Fixed IDs for predictability
const SYSTEM_USER_ID = ObjectId('695be8641909d30d16e9496a');
const PUBLIC_CONVERSATION_ID = ObjectId('695be8641909d30d16e9496b');

// Create a default admin user for the public conversation
const adminUser = {
    _id: SYSTEM_USER_ID,
    username: 'System',
    email: 'system@whatsapp.local',
    password: '$2b$10$placeholder', // This won't be used for login
    createdAt: new Date(),
    updatedAt: new Date()
};

db.users.insertOne(adminUser);

// Create the public conversation
const publicConversation = {
    _id: PUBLIC_CONVERSATION_ID,
    name: 'Général',
    members: [adminUser._id],
    admin: adminUser._id,
    blockedUsers: [],
    createdAt: new Date(),
    updatedAt: new Date()
};

db.conversations.insertOne(publicConversation);

print('✅ Database initialized with public conversation');
print('📝 Public Conversation ID: ' + publicConversation._id);
print('👤 System User ID: ' + adminUser._id);
