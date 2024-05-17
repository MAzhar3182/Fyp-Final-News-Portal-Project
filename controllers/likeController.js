import LikeModal from "../models/Like.js";
import NewsModal from "../models/News.js";
export const likeIncrementedCount=async (req, res) => {
    try {
      // Extract userId and newsId from the request body
      const { userId, newsId } = req.body;
      // Check if the user has already liked the news article
      const existingLike = await LikeModal.findOne({ userId, newsId });
      if (existingLike) {
        // User has already liked the news article, return an error response
        return res.status(400).json({ success: false, message: 'User has already liked this news article' });
      }
      // Create a new like document
      const newLike = new LikeModal({ userId, newsId });
      console.log(newLike)
      await newLike.save();
      // Increment the likesCount field in the NewsModal for the corresponding news article
      await NewsModal.findByIdAndUpdate(newsId, { $inc: { likesCount: 1 } });
      // Return a success response
      res.status(200).json({ success: true, message: 'News article liked successfully' });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };