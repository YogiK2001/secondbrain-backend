import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from "../config";



export const userMiddleware = (req: Request, res:Response, next:NextFunction) => {
    const header = req.headers["authorization"];
    if (!header) {
        res.status(401).json({
            message: "No token provided"
        });
        return;
    }
    try {
    const decoded = jwt.verify(header as string, JWT_SECRET ) as JwtPayload;
      if(!decoded.id)  {
        res.status(401).json({
            message: "Invalid Token Payload"
        });
    }
    
    req.userId = (decoded as JwtPayload).id
    next();
    
 } catch(e) {
    res.status(403).json({
        message: "Unauthorized"
    })
 }
}

