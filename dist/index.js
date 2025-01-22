"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./database/db");
const middleware_1 = require("./middleware/middleware");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const signupSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, "Username is required"),
    password: zod_1.z.string()
        .min(3, { message: "Password must be at least 3 characters long" })
        .max(20, { message: "Password must not exceed 20 characters" })
        .regex(/(?=.*[a-z])/, { message: "Password must contain at least one lowercase letter" })
        .regex(/(?=.*[A-Z])/, { message: "Password must contain at least one uppercase letter" })
        .regex(/(?=.*\d)/, { message: "Password must contain at least one number" })
        .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, { message: "Password must contain at least one special character" })
});
app.post('/api/v1/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateUser = signupSchema.safeParse(req.body);
        if (!validateUser.success) {
            res.status(400).json({
                message: 'Validation Error',
                errors: validateUser.error.errors
            });
            return;
        }
        const existingUser = yield db_1.UserModel.findOne({
            username: validateUser.data.username
        });
        if (existingUser) {
            res.status(403).json({
                message: 'User already exists'
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(validateUser.data.password, 10);
        const user = yield db_1.UserModel.create({
            username: validateUser.data.username,
            password: hashedPassword
        });
        process.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({
            message: 'User created successfully',
            token
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}));
app.post('/api/v1/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const existingUser = yield db_1.UserModel.findOne({
            username: username,
            password: password
        });
        if (existingUser) {
            const token = jsonwebtoken_1.default.sign({
                id: existingUser._id,
            }, process.env.JWT_SECRET);
            res.json({
                token
            });
        }
        else {
            res.status(403).json({
                message: "Invalid Credentials"
            });
        }
    }
    catch (e) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}));
// app.post('/api/v1/content', userMiddleware,  async (req,  res) => {
//     const { link, type, title, tag } = req.body
//     const tagsId = [];
//     for( const tagName in tag ) {
//         let existingTag = await TagModel.findOne({ name: tagName });
//         if( !existingTag) {
//             existingTag = await TagModel.create({
//                 name: tagName
//             })
//         }
//         tagsId.push(existingTag._id);
//     }
//     await ContentModel.create({
//         link,
//         type,
//         title,
//         userId: req.userId,
//         tag: tagsId
//     })
//     res.json({
//         message: "Content Added"
//     })
// });
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const link = req.body.link;
    const type = req.body.type;
    //ts-ignore
    const userId = req.userId;
    yield db_1.ContentModel.create({
        link,
        type,
        title: req.body.title,
        userId,
        tags: []
    });
    res.json({
        message: "Content added"
    });
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    const content = yield db_1.ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    });
}));
// app.delete('/api/v1/content', userMiddleware,  async (req, res) => {
// });
// app.post('/api/v1/brain/share', userMiddleware,  async (req, res) => {});
// app.get('/api/v1/brain/:sharelink', userMiddleware,  async (req, res) => {});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
