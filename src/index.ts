import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { userMiddleware } from './middleware/middleware';
import { UserModel} from './database/db';
import 'dotenv/config'
import { z } from "zod";
import bcrypt from 'bcrypt';
const app = express();



app.post('/api/v1/singup', async (req, res) => {
    try {
    const requiredResponse = z.object({
        username: z.string(),
        password: z.string()
            .min(3, { message: "Password must be at least 3 characters long" })
            .max(20, { message: "Password must not exceed 20 characters" })
            .regex(/(?=.*[a-z])/, { message: "Password must contain at least one lowercase letter" })
            .regex(/(?=.*[A-Z])/, { message: "Password must contain at least one uppercase letter" })
            .regex(/(?=.*\d)/, { message: "Password must contain at least one number" })
            .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, { message: "Password must contain at least one special character" })
    });

    const validateUser = requiredResponse.safeParse(req.body);

    if(validateUser.success) {
    

    const existingUser = await UserModel.findOne({ username: req.body.username });
    if(existingUser) {
        return res.status(403).json({errors: 'Alreday Existing user'})
    }
    
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await UserModel.create({
        ...validateUser,
        password: hashedPassword
    })

    const token =  jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);

    res.status(200).json({ 
        message: 'User created',
        token: token 
    });
} else {
    return res.status(411).json({
        message: 'Validation Error',
    })}
} catch (err) {
    res.status(500).json({
        message: 'Internal Server Error'
    })
}

 

    
});
app.post('/api/v1/singin', async (req, res) => {

});

app.post('/api/v1/content', userMiddleware,  async (req, res) => {

});
app.get('/api/v1/content', userMiddleware,  async (req, res) => {

});

app.delete('/api/v1/content', userMiddleware,  async (req, res) => {

});

app.post('/api/v1/brain/share', userMiddleware,  async (req, res) => {});

app.get('/api/v1/brain/:sharelink', userMiddleware,  async (req, res) => {});