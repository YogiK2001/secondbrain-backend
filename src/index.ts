import express from 'express';

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { userMiddleware } from './middleware/middleware';
import { UserModel} from './database/db';
import 'dotenv/config'
import { z } from "zod";
import bcrypt from 'bcrypt';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());

// type SignupInput = z.infer<typeof requiredResponse>;

app.post('/api/v1/signup', async (req, res)=> {
    // Schema validation
    const signupSchema = z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string()
            .min(3, { message: "Password must be at least 3 characters long" })
            .max(20, { message: "Password must not exceed 20 characters" })
            .regex(/(?=.*[a-z])/, { message: "Password must contain at least one lowercase letter" })
            .regex(/(?=.*[A-Z])/, { message: "Password must contain at least one uppercase letter" })
            .regex(/(?=.*\d)/, { message: "Password must contain at least one number" })
            .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, { message: "Password must contain at least one special character" })
    });

    try {
        // Validate request body
        const validateUser = signupSchema.safeParse(req.body);

        if (!validateUser.success) {
            res.status(400).json({
                message: 'Validation Error',
                errors: validateUser.error.errors
            });
            return;
        }

        // Check for existing user
        const existingUser = await UserModel.findOne({ 
            username: validateUser.data.username 
        });

        if (existingUser) {
            res.status(403).json({
                message: 'User already exists'
            });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(validateUser.data.password, 10);

        const user = await UserModel.create({
            username: validateUser.data.username,
            password: hashedPassword
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET as string
        );

        res.status(200).json({
            message: 'User created successfully',
            token
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});


app.post('/api/v1/signin', async (req, res) => {

});

// app.post('/api/v1/content', userMiddleware,  async (req, res) => {

// });
// app.get('/api/v1/content', userMiddleware,  async (req, res) => {

// });

// app.delete('/api/v1/content', userMiddleware,  async (req, res) => {

// });

// app.post('/api/v1/brain/share', userMiddleware,  async (req, res) => {});

// app.get('/api/v1/brain/:sharelink', userMiddleware,  async (req, res) => {});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// function cors(): any {
//     throw new Error('Function not implemented.');
// }
