/**
 * Simple conflict resolution utilities for collaborative editing
 */

/**
 * Merge two text contents with basic conflict resolution
 * This is a simplified approach - in production, you'd want more sophisticated OT (Operational Transform) or CRDT algorithms
 */
export const mergeTextContent = (localContent, remoteContent, baseContent = '') => {
  // If contents are the same, no conflict
  if (localContent === remoteContent) {
    return localContent;
  }

  // If local hasn't changed from base, accept remote
  if (localContent === baseContent) {
    return remoteContent;
  }

  // If remote hasn't changed from base, keep local
  if (remoteContent === baseContent) {
    return localContent;
  }

  // Simple conflict resolution: try to merge by finding common parts
  // This is a basic implementation - you might want to use diff-patch libraries
  const localLines = localContent.split('\n');
  const remoteLines = remoteContent.split('\n');
  const baseLines = baseContent.split('\n');

  // For now, we'll prefer the remote content in case of conflicts
  // and add a conflict marker
  return remoteContent + '\n\n<!-- Conflict detected - please review -->';
};

/**
 * Check if two document states have conflicts
 */
export const hasConflict = (localContent, remoteContent, lastSyncedContent) => {
  const localChanged = localContent !== lastSyncedContent;
  const remoteChanged = remoteContent !== lastSyncedContent;
  
  return localChanged && remoteChanged && localContent !== remoteContent;
};

/**
 * Generate a simple diff between two texts
 */
export const generateDiff = (oldText, newText) => {
  // This is a very basic diff - in production you'd use a proper diff library
  if (oldText === newText) {
    return null;
  }

  return {
    type: 'text-change',
    oldText,
    newText,
    timestamp: Date.now()
  };
};

/**
 * Apply operational transform for basic text operations
 */
export const transformOperation = (operation, againstOperation) => {
  // Simplified OT - this would need to be much more sophisticated for production
  // For now, we'll just return the operation as-is
  return operation;
};