import mongoose, { model, Schema } from 'mongoose';
import * as dotenv from 'dotenv';
import 'dotenv/config'
dotenv.config({ path: __dirname+'/.env' });

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}

mongoose.connect(process.env.MONGODB_URI);
console.log('Connected to MongoDB');

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
})

export const UserModel = model('User', UserSchema);


const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    type: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true },
})

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
})

export const LinkModel = model("Links", LinkSchema);
export const ContentModel = model("Content", ContentSchema);
