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
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

export default Document;