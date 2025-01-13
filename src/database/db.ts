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



const NoteSchemaNew = new Schema({
    title: { type: String},
    content: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User'},
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}]
});


const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    type: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true },
})

const TagSchema = new Schema({
    name: { type: String, unique: true}
})

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
})


export const UserModel = model('User', UserSchema);
export const LinkModel = model("Links", LinkSchema);
export const ContentModel = model("Content", ContentSchema);
export const TagModel = model("Tags", TagSchema);
export const NoteModel = model("Notes", NoteSchemaNew);
