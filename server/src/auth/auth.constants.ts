import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
    secretOrKey: process.env.JWT_SECRET,
    expiresIn: '1h',
};