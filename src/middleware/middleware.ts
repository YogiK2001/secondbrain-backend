import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from "../config";



// interface CustomJwtPayload extends JwtPayload {
//     id: string;
// } 

export const userMiddleware = (req: Request, res:Response, next:NextFunction) => {
    const header = req.headers["authorization"];

    if (!header) {
        return res.status(401).json({
            message: "No token provided"
        });
    }
    
    const decode = jwt.verify(header, JWT_SECRET )
    if(decode){
        if (typeof decode === "string") {
            res.status(403).json({
                message: "You are not logged in"
            })
            return;    
        }
        req.userId = (decode as JwtPayload).id as string;
        next();
    } else {
        res.status(403).json({
            message: "Unauthorized"
        })
    }
}