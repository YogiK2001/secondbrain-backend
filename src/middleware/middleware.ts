import { NextFunction, Request, Response } from "express";
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// interface CustomRequest extends Request {
//     userId?: string;
// }
import jwt, { JwtPayload } from 'jsonwebtoken';



export const userMiddleware = (req: Request, res:Response, next:NextFunction) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, JWT_SECRET);
    if (decoded) {
        if (typeof decoded === "string") {
            res.status(403).json({
                message: "You are not logged in"
            })
            return;    
        }
        
        req.userId = decoded.id as string;
        next()
    } else {
        res.status(403).json({
            message: "You are not logged in"
        })
    }
}

