"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteModel = exports.TagModel = exports.ContentModel = exports.LinkModel = exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
require("dotenv/config");
dotenv.config({ path: __dirname + '/.env' });
if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
}
mongoose_1.default.connect(process.env.MONGODB_URI);
console.log('Connected to MongoDB');
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true },
    password: String
});
const NoteSchemaNew = new mongoose_1.Schema({
    title: { type: String },
    content: { type: String, required: true },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User' },
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tags' }]
});
const ContentSchema = new mongoose_1.Schema({
    title: String,
    link: String,
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tags' }],
    type: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true },
});
const TagSchema = new mongoose_1.Schema({
    name: { type: String, unique: true }
});
const LinkSchema = new mongoose_1.Schema({
    hash: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true, unique: true },
});
exports.UserModel = (0, mongoose_1.model)('User', UserSchema);
exports.LinkModel = (0, mongoose_1.model)("Links", LinkSchema);
exports.ContentModel = (0, mongoose_1.model)("Content", ContentSchema);
exports.TagModel = (0, mongoose_1.model)("Tags", TagSchema);
exports.NoteModel = (0, mongoose_1.model)("Notes", NoteSchemaNew);
