import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import NewsModal from "../models/News.js";
import fs from "fs";
import sharp from "sharp";
import { v4 as uuidv4 } from 'uuid';
import Category from "../models/Category.js";
// Sign Up Function
import multer from 'multer';
import moment from 'moment';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
export const userRegistration = async (req, res) => {
  const { name, email, password, password_confirmation, tc, gender, age } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });

    if (user) {
      return res.send({ "status": "Failed", "message": "Email Already Exists" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      name,
      email,
      password: hashPassword,
      gender: gender || null,
      age: age || null,
      tc
    });

    // Check if a profile image is provided
    if (req.file) {
      const profileImageBuffer = req.file.buffer;
      const profileImageBase64 = profileImageBuffer.toString('base64');
      // Save or process the profile image as needed and store the URL/path in the database
      doc.profileImage = `data:image/jpeg;base64,${profileImageBase64}`;
    }

    await doc.save();
    const saved_user = await UserModel.findOne({ email: email });

    const token = jwt.sign(
      { userId: saved_user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5d" }
    );

    res.status(201).send({
      "status": "success",
      "message": "User Successfully Registered",
      "token": token
    });
  } catch (error) {
    console.error(error);
    res.send({ "status": "Failed", "message": "Unable To Register" });
  }
};

// Example API endpoint to get user data based on the token
export const getUserData = async (req, res) => {
  try {
    // Use the user data attached to the request by the authenticateUser middleware
    const userData = req.user;
    res.status(200).json({ success: true, userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Login Function
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await UserModel.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (user.email === email && isMatch) {
          // Generate jwtToken
          const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );

          res.send({ "status": "success", "message": "Login SuccessFully", "token": token });
        } else {
          res.send({ "status": "Failed", "message": "Email or Password is Not Valid" });
        }
      } else {
        res.send({ "status": "Failed", "message": "You Are Not a Registered User" });
      }
    } else {
      res.send({ "status": "Failed", "message": "All Fields Are Required" });
    }
  } catch (error) {
    res.send({ "status": "Failed", "message": "Unable To Login" });
  }
};
// Function for updating user profile
export const updateProfile = async (req, res) => {
  const userId = req.params._id; // Get user ID from request parameters
  const { name, email, gender, age } = req.fields; // Assuming form data is sent using formidable

  try {
    // Check if the user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update the user profile fields
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (gender) {
      user.gender = gender;
    }
    if (age) {
      user.age = age;
    }
    
    // Save the updated user profile
    await user.save();
    res.status(200).json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// News Post
export const postNews = async (req, res) => {
  try {
    const { title, description,channel, category, person } = req.fields;
      // Assuming you are using multer for file uploads, make sure to handle the image file correctly
      const { image } = req.files;
      switch (true) {
        case !title:
          return res.status(500).send({ error: "Title is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !category:
          return res.status(500).send({ error: "Category is Required" });
        case !person:
          return res.status(500).send({ error: "Person is Required" });
        case image && image.size > 1000000:
          return res
            .status(500)
            .send({ error: "Image is Required" });
      }
  
   // Generate a random ID using uuid
   const newsId = uuidv4();

   // Create a new NewsModal instance with the random ID
   const products = new NewsModal({
     _id: newsId,
     title,
     description,
     channel,
     category,
     person,
   });

   // If there's an image, process and save it
   if (image) {
     products.image.data = fs.readFileSync(image.path);
     products.image.contentType = image.type;
   }

   // Save the news item to the database
   await products.save();

   res.status(201).json({ success: true, message: 'News Post Successfully', products });
 } catch (error) {
   console.error(error);
   res.status(500).json({ success: false, error: 'Internal Server Error' });
 }
};
// Helper function to compress and convert image data to a smaller URL
const generateSmallImageUrl = async (imageData) => {
  const compressedImageData = await compressImage(imageData);
  return `data:image/jpeg;base64,${compressedImageData.toString('base64')}`;
};

// Helper function to compress image data
const compressImage = async (imageData) => {
  return sharp(imageData)
    .toBuffer();
};
// Get News Function
export const getNews = async (req, res) => {
  try {
    // Retrieve all news from the database
    const allNews = await NewsModal.find({});

    // Map through each news item to include the image data and generate a smaller URL
    const newsWithImage = await Promise.all(allNews?.map(async (news) => {
      try {
        const smallImageUrl = await generateSmallImageUrl(news.image.data);

        return {
          _id: news._id,
          title: news.title,
          channel: news.channel,
          description: news.description,
          category: news.category,
          person: news.person,
          image: {
            url: smallImageUrl,
            contentType: news.image.contentType,
          },
          timestamp: news.timestamp,
        };
      } catch (error) {
        // Handle the error appropriately
        return {
          _id: news._id,
          title: news.title,
          channel: news.channel,
          description: news.description,
          category: news.category,
          person: news.person,
          timestamp: news.timestamp,
        };
      }
    }));

    res.status(200).json({ success: true, news: newsWithImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
// Delete News Function
export const deleteNews = async (req, res) => {
  try {
    // Use req.params.id instead of req.params._id
    const deletedNews = await NewsModal.deleteOne({ _id: req.params.id });

    // Check if the news item was found and deleted
    if (deletedNews) {
      res.status(200).send({
        success: true,
        message: "News Deleted successfully",
        deleteNews
      });
    } else {
      res.status(404).send({
        success: false,
        message: "News not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting news",
      error,
    });
  }
};
// Notification
export const getLatestNewsTitle = async (req, res) => {
  try {
    // Get the start of today in UTC timezone
    const startOfToday = moment().startOf('day').utc();
    // Get the end of today in UTC timezone
    const endOfToday = moment().endOf('day').utc();
    // Retrieve all news posted today
    const newsOfToday = await NewsModal.find({
      timestamp: { $gte: startOfToday, $lte: endOfToday } // Filter by news posted today
    }).sort({ timestamp: -1 });
    if (newsOfToday.length > 0) {
      const formattedNews = newsOfToday.map(news => ({
        _id: news._id,
        title: news.title,
        description: news.description,
        timestamp: news.timestamp // Include the timestamp in the response
      }));
      res.status(200).json({ success: true, newsOfToday: formattedNews });
    } else {
      res.status(404).json({ success: false, message: 'No news found today' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Category Create
export const categoryNews = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    // Create a new category and save it to the database
    const newCategory = new Category({ name });
    await newCategory.save();

    res.status(201).json({ success: true, message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
// Get Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
// Get Single News
export const getSingleNews = async (req, res) => {
  try {
    // Retrieve the news item ID from the request parameters
    const { id } = req.params;
    // Check if the provided ID is valid
    if (!id) {
      return res.status(400).json({ success: false, message: 'Invalid ID provided' });
    }
    // Find the news item by ID in the database
    const newsItem = await NewsModal.findById(id);
    // Check if the news item exists
    if (newsItem) {
      // Process the image if it exists
      let newsWithImage = { ...newsItem._doc }; // Clone the news item data
      if (newsItem.image && newsItem.image.data) {
        const smallImageUrl = await generateSmallImageUrl(newsItem.image.data);
        newsWithImage.image = {
          url: smallImageUrl,
          contentType: newsItem.image.contentType
        };
      }
      return res.status(200).json({ success: true, newsItem: newsWithImage });
    } else {
      return res.status(404).json({ success: false, message: 'News item not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
