import dotenv from "dotenv";   
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/connectdb.js";
import userRoutes from "./routes/userRoutes.js";
import likesRoutes from "./routes/likesRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import authenticateUser from "./middlewares/user-auth-middleware.js";
const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

// Cors Policy
app.use(cors());

// DataBase Connection
connectDB(DATABASE_URL);

// Json
app.use(express.json());

// Apply the authenticateUser middleware globally
app.use("/api/user",userRoutes);
app.use('/api', authenticateUser);
// Load Routes
app.use("/api/like-details",likesRoutes);
app.use("/api/news",newsRoutes);
app.listen(port, () => {
  console.log(`Server is Listening at http://localhost:${port}`);
});
