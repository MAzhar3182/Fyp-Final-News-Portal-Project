import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
const newsSchema = new mongoose.Schema({
  _id: {
    type: String,  // Change the type to String for UUID
    default: uuidv4,  // Set the default value to a generated UUID
  },
  title: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
  },
  person: {
    type: String,
    required: true,
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
const NewsModal = mongoose.model('News', newsSchema);
export default NewsModal;