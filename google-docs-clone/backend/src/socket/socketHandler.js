const presenceService = require('../services/presenceService');

// In your socket connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-document', async (data) => {
    const { documentId, userId, userName } = data;
    
    // Join socket room
    socket.join(documentId);
    
    // Add to Redis presence
    await presenceService.addUserToDocument(documentId, userId, {
      userName,
      socketId: socket.id,
      joinedAt: Date.now()
    });
    
    // Get current users and broadcast
    const users = await presenceService.getUsersInDocument(documentId);
    io.to(documentId).emit('users-in-document', users);
  });

  // Heartbeat to keep presence alive
  socket.on('heartbeat', async (data) => {
    const { documentId, userId } = data;
    await presenceService.updateUserActivity(documentId, userId);
  });

  socket.on('disconnect', async () => {
    // Find which documents this socket was in
    const rooms = Array.from(socket.rooms);
    
    for (const room of rooms) {
      if (room !== socket.id) { // Skip the socket's own room
        // Remove from Redis presence
        const users = await presenceService.getUsersInDocument(room);
        const userToRemove = Object.keys(users).find(
          userId => users[userId].socketId === socket.id
        );
        
        if (userToRemove) {
          await presenceService.removeUserFromDocument(room, userToRemove);
          const updatedUsers = await presenceService.getUsersInDocument(room);
          io.to(room).emit('users-in-document', updatedUsers);
        }
      }
    }
  });
});

// Subscribe to presence updates for cross-server communication
presenceService.subscribeToPresenceUpdates('*', (update) => {
  const { type, documentId, userId, userData } = update;
  
  if (type === 'user_joined') {
    io.to(documentId).emit('user-joined', { userId, userData });
  } else if (type === 'user_left') {
    io.to(documentId).emit('user-left', { userId });
  }
});