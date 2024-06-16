import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {getPoolInstance} from "../db";
import i18next from '../i18n';
import {Session} from "../types";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const pool = getPoolInstance()

const sessions: { [sessionId: string]: Session } = {};
// Helpe
function generateSessionId() {
    return uuidv4();
}


export async function loginUser(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
        // Retrieve user from the database by username
        const user = await getUserByUsername(username);

        if (!user) {
            // @ts-ignore
            return res.status(401).json({ message: i18next.t('common:errorInvalidUserName') });
        }

        // Compare hashed password with input password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            // @ts-ignore
            return res.status(401).json({ message: i18next.t('common:errorInvalidUserName') });
        }

        // @ts-ignore
        const token = jwt.sign({ userId: user.id, name: user.name, username: user.username}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('authorization', token, {
            // Optional cookie options
            maxAge: 3600000, // 1 hour in milliseconds
            httpOnly: true, // Cookie accessible only through HTTP(S) headers
            secure: process.env.NODE_ENV === 'production' // Only send cookie over HTTPS in production
        });
        res.status(200).json(i18next.t('common:loginSuccess')).end()

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: i18next.t('common:internalServerError') });
    }
}

async function getUserByUsername(username: string): Promise<any> {
    const { rows } = await getPoolInstance().query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0];
}


export async function registerUser(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            // @ts-ignore
            return res.status(400).json({ message: i18next.t('common:usernameAlreadyExists') });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await insertUser(username, hashedPassword);

        // @ts-ignore
        const token = jwt.sign({ userId: user.id, name: user.name, username: user.username}, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the token in a cookie
        res.cookie('authorization', token, {
            // Optional cookie options
            maxAge: 3600000, // 1 hour in milliseconds
            httpOnly: true, // Cookie accessible only through HTTP(S) headers
            secure: process.env.NODE_ENV === 'production' // Only send cookie over HTTPS in production
        });
        res.status(201).json(i18next.t('common:registerSuccess')).end();
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: i18next.t('common:internalServerError') });
    }
}

async function insertUser(username: string, password: string): Promise<void> {
    const pool = getPoolInstance();
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', [username, password]);

    // Extract the inserted user ID from the result
    return result.rows[0].id;
}


export function logout(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.authorization;
        res.clearCookie('authorization');
        res.status(201).json({ message: i18next.t('common:logoutSuccessful') });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'An error occurred during logout' });
    }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies['authorization'];
    if (!token) {
        // @ts-ignore
        return res.status(401).json({ message: i18next.t('common:authenticationTokenMissing') });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
        if (err) {
            return res.status(403).json({ message: i18next.t('common:authenticationTokenMissing') });
        }
        // @ts-ignore
        req.user = decoded;
        next();
    });
}
