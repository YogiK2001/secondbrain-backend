import mongoose, { model, Schema } from 'mongoose';
import * as dotenv from 'dotenv';
import 'dotenv/config'
dotenv.config({ path: __dirname+'/.env' });

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}

mongoose.connect(process.env.MONGODB_URI);

const userSchema = new Schema({
    username: { 
        type: String, 
        unique: true,
        minlength: 3,
    },
    password: { 
        type: String,
        minlength: 8,
    }
})

export const UserModel = model('User', userSchema);

