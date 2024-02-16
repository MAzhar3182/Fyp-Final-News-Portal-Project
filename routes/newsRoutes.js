import express from 'express';
import formidableMiddleware from 'express-formidable';
import * as UserController from '../controllers/userController.js';
import authenticateUser from '../middlewares/user-auth-middleware.js';
const router = express.Router();
// Apply the authenticateUser middleware to protect the route
router.use(authenticateUser);
// Use the getUserData endpoint for authenticated routes
router.get('/user/data', UserController.getUserData);
router.get('/get-news', UserController.getNews);
router.get('/single-news/:id', UserController.getSingleNews);
router.get('/latest-news-title', UserController.getLatestNewsTitle);
// Update the route definition for deleteNews
router.delete('/post-news/:id', UserController.deleteNews);
// Category Routes
router.post('/category', UserController.categoryNews); // Create a new category
router.get('/categories', UserController.getCategories); // Get all categories
// Use formidable middleware to parse form data
router.use(formidableMiddleware());
// Define the route to handle profile updates
router.post('/user/update-data/:_id', UserController.updateProfile);
// Use formidable middleware for handling file uploads
router.post('/post-news', UserController.postNews);
export default router;

