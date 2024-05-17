import express from 'express';
import * as LikeController from '../controllers/likeController.js';
import authenticateUser from '../middlewares/user-auth-middleware.js';
const router = express.Router();
// Apply the authenticateUser middleware to protect the route
router.use(authenticateUser);
// Like News Article
router.post('/like',LikeController.likeIncrementedCount);
export default router;