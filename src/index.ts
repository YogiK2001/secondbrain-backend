import express, { Request, Response } from "express";
import { z } from 'zod'
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ContentModel, LinkModel, UserModel } from "./database/db";
import { userMiddleware } from "./middleware/middleware";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());

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

app.post('/api/v1/signup', async (req, res)=> {
    
    try {

        const validateUser = signupSchema.safeParse(req.body);

        if (!validateUser.success) {
            res.status(400).json({
                message: 'Validation Error',
                errors: validateUser.error.errors
            });
            return;
        }

        const existingUser = await UserModel.findOne({ 
            username: validateUser.data.username 
        });

        if (existingUser) {
            res.status(403).json({
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(validateUser.data.password, 10);

        const user = await UserModel.create({
            username: validateUser.data.username,
            password: hashedPassword
        });

            process.env.JWT_SECRET as string
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


app.post('/api/v1/signin', async (req: Request, res: Response) => {
    try{
        const { username, password } = req.body;

    const existingUser = await UserModel.findOne({
        username: username,
        password: password
    })

    if(existingUser) {
        const token = jwt.sign({
            id: existingUser._id,
        }, process.env.JWT_SECRET as string)

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Invalid Credentials"
        });
    }
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error"
    });
    }

});


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

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    const userId = req.userId;;
    await ContentModel.create({
        link,
        type,
        title: req.body.title,
        userId,
        tags: []
    })

    res.json({
        message: "Content added"
    })
    
})

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username")
    res.json({
        content
    })
})

// app.delete('/api/v1/content', userMiddleware,  async (req, res) => {

// });

// app.post('/api/v1/brain/share', userMiddleware,  async (req, res) => {});

// app.get('/api/v1/brain/:sharelink', userMiddleware,  async (req, res) => {});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


