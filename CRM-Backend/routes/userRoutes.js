// routes/userRoutes.js
import express from 'express';
import { getUserByEmail, getUsers } from '../controllers/userController.js'; // Adjust the path accordingly

const router = express.Router();

// Route to fetch user by email
router.get('/users/email', getUserByEmail); // Changed the endpoint to /email for clarity
// Route to fetch paginated and filtered users
router.get('/users', getUsers); // This endpoint will handle fetching users with pagination and filtering

export default router;
