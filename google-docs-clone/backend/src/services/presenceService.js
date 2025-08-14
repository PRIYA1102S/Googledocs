const redis = require('redis');

class PresenceService {
  constructor() {
    this.client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    });
    
    this.publisher = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    });
    
    this.subscriber = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    });

    this.client.connect();
    this.publisher.connect();
    this.subscriber.connect();
  }

  // Add user to document presence
  async addUserToDocument(documentId, userId, userData) {
    const key = `presence:${documentId}`;
    const userKey = `user:${userId}`;
    
    // Store user data with timestamp
    const userInfo = {
      ...userData,
      lastSeen: Date.now(),
      socketId: userData.socketId
    };
    
    await this.client.hSet(key, userKey, JSON.stringify(userInfo));
    await this.client.expire(key, 300); // 5 minutes TTL
    
    // Publish presence update
    await this.publisher.publish(`presence:${documentId}:updates`, JSON.stringify({
      type: 'user_joined',
      documentId,
      userId,
      userData: userInfo
    }));
  }

  // Remove user from document
  async removeUserFromDocument(documentId, userId) {
    const key = `presence:${documentId}`;
    const userKey = `user:${userId}`;
    
    const userData = await this.client.hGet(key, userKey);
    await this.client.hDel(key, userKey);
    
    // Publish presence update
    await this.publisher.publish(`presence:${documentId}:updates`, JSON.stringify({
      type: 'user_left',
      documentId,
      userId,
      userData: userData ? JSON.parse(userData) : null
    }));
  }

  // Get all users in document
  async getUsersInDocument(documentId) {
    const key = `presence:${documentId}`;
    const users = await this.client.hGetAll(key);
    
    const activeUsers = {};
    const now = Date.now();
    
    for (const [userKey, userDataStr] of Object.entries(users)) {
      const userData = JSON.parse(userDataStr);
      // Remove stale users (older than 2 minutes)
      if (now - userData.lastSeen > 120000) {
        await this.client.hDel(key, userKey);
      } else {
        const userId = userKey.replace('user:', '');
        activeUsers[userId] = userData;
      }
    }
    
    return activeUsers;
  }

  // Update user activity (heartbeat)
  async updateUserActivity(documentId, userId) {
    const key = `presence:${documentId}`;
    const userKey = `user:${userId}`;
    
    const userData = await this.client.hGet(key, userKey);
    if (userData) {
      const userInfo = JSON.parse(userData);
      userInfo.lastSeen = Date.now();
      await this.client.hSet(key, userKey, JSON.stringify(userInfo));
    }
  }

  // Subscribe to presence updates
  subscribeToPresenceUpdates(documentId, callback) {
    this.subscriber.subscribe(`presence:${documentId}:updates`);
    this.subscriber.on('message', (channel, message) => {
      if (channel === `presence:${documentId}:updates`) {
        callback(JSON.parse(message));
      }
    });
  }

  // Cleanup on disconnect
  async cleanup() {
    await this.client.quit();
    await this.publisher.quit();
    await this.subscriber.quit();
  }
}

module.exports = new PresenceService();