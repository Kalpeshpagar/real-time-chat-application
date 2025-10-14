import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export const generateToken = (userId) => {
    dotenv.config();
    return jwt.sign({ userId}, process.env.JWT_SECRET, { expiresIn: '7d' });
}