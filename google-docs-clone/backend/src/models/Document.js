import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
   content: [
    {
      type: {
        type: String,
        enum: ['text', 'image'],
        required: true
      },
      content: { type: String }, // for text
      src: { type: String },     // for images
      alt: { type: String }      // optional
    }
  ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Sharing and collaboration settings
    isPublic: {
        type: Boolean,
        default: false
    },
    shareableLink: {
        type: String,
        unique: true,
        sparse: true // allows null values and doesn't enforce uniqueness for null
    },
    collaborators: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        permission: {
            type: String,
            enum: ['viewer', 'editor'],
            required: true
        },
        invitedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        invitedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'declined'],
            default: 'accepted'
        }
    }],
    shareSettings: {
        allowViewerComments: {
            type: Boolean,
            default: false
        },
        allowEditorInvites: {
            type: Boolean,
            default: false
        },
        requireApprovalForNewCollaborators: {
            type: Boolean,
            default: false
        }
    }
}, { timestamps: true });

// Utility methods for document permissions
function normalizeId(id) {
    // Handle populated documents (objects with _id) and raw ObjectIds/strings
    if (id && typeof id === 'object' && id._id) {
        return id._id.toString();
    }
    return id ? id.toString() : '';
}

documentSchema.methods.getUserPermission = function(currentUserId) {
    const ownerId = normalizeId(this.userId);
    const currentId = normalizeId(currentUserId);

    if (ownerId && ownerId === currentId) {
        return 'owner';
    }

    const collaborator = this.collaborators.find((collab) => {
        const collabUserId = normalizeId(collab.userId);
        return collabUserId === currentId && collab.status === 'accepted';
    });

    return collaborator ? collaborator.permission : null;
};

documentSchema.methods.canView = function(currentUserId) {
    const permission = this.getUserPermission(currentUserId);
    return permission !== null || this.isPublic;
};

documentSchema.methods.canEdit = function(currentUserId) {
    const permission = this.getUserPermission(currentUserId);
    return permission === 'owner' || permission === 'editor';
};

documentSchema.methods.canManageCollaborators = function(currentUserId) {
    const permission = this.getUserPermission(currentUserId);
    return permission === 'owner' || (permission === 'editor' && this.shareSettings.allowEditorInvites);
};

documentSchema.methods.addCollaborator = function(userId, permission, invitedBy) {
    // Check if user is already a collaborator
    const existingCollaborator = this.collaborators.find(
        collab => collab.userId.toString() === userId.toString()
    );
    
    if (existingCollaborator) {
        throw new Error('User is already a collaborator');
    }
    
    this.collaborators.push({
        userId,
        permission,
        invitedBy,
        status: 'accepted'
    });
};

documentSchema.methods.removeCollaborator = function(userId) {
    const targetId = normalizeId(userId);
    this.collaborators = this.collaborators.filter((collab) => normalizeId(collab.userId) !== targetId);
};

documentSchema.methods.updateCollaboratorPermission = function(userId, newPermission) {
    const targetId = normalizeId(userId);
    const collaborator = this.collaborators.find((collab) => normalizeId(collab.userId) === targetId);

    if (collaborator) {
        collaborator.permission = newPermission;
    } else {
        throw new Error('Collaborator not found');
    }
};

const Document = mongoose.model('Document', documentSchema);

export default Document;