import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News',
    type: String,
    required: true,
  },
});

const LikeModal= mongoose.model('Like', likeSchema);

export default LikeModal;
