import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { postgraphile } from 'postgraphile';
import { customSchemaPlugin } from '../resolver/customResolver';
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';
import { authenticateToken, loginUser, logout, registerUser } from '../userLogin/loginUtils';
import { getPoolInstance } from '../db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();
const router = express.Router();


// Function to ensure directory exists
const ensureDirectoryExists = async (directory: string): Promise<void> => {
    try {
        await fs.promises.mkdir(directory, { recursive: true });
    } catch (err) {
        //@ts-ignore
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
};

// Multer disk storage configuration
const storage = multer.diskStorage({
    destination: async (req: Request, file: Express.Multer.File, cb) => {
        const uploadDir = path.join(__dirname, '..', '..','uploads'); // Assuming uploads folder is created in the root folder
        try {
            await ensureDirectoryExists(uploadDir);
            cb(null, uploadDir); // Specify the destination directory
        } catch (err) {
            console.error('Error creating uploads directory:', err);
            //@ts-ignore
            cb(err, null);
        }
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
    },
});

const upload = multer({ storage });

// Route for user login
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/logout', logout);
router.get('/protected', authenticateToken, (req, res) => {
    //@ts-ignore
    res.status(201).json({ message: 'Protected route accessed successfully', user: req.user });
});

// Apply authentication middleware to all routes except /login and /register
router.use((req: Request, res: Response, next) => {
    if (req.path === '/logout' || req.path === '/login' || req.path === '/register') {
        next();
    } else {
        authenticateToken(req, res, next);
    }
});

// Route to get video by filename
router.get('/video/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename;
    const videoPath = path.join(__dirname, '..', '..', 'uploads', filename);

    // Check if the file exists
    if (!fs.existsSync(videoPath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    // Create a readable stream to the video file
    const stream = fs.createReadStream(videoPath);

    // Handle stream events
    stream.on('open', () => {
        // Set appropriate headers
        res.setHeader('Content-Type', 'video/mp4'); // Adjust content type based on your file type
        res.setHeader('Content-Disposition', 'inline');

        // Pipe the video stream to the response
        stream.pipe(res);
    });

    stream.on('error', (err) => {
        console.error('Error streaming video file:', err);
        res.status(500).json({ error: 'Internal server error' });
    });
});

// New route for handling video uploads
router.post('/upload-video', upload.single('video'), (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const videoUrl = `/video/${req.file.filename}`; // Construct the URL to access the uploaded file

        res.status(200).json({ message: 'File uploaded successfully', videoUrl });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Mount PostGraphile middleware
router.use(
    postgraphile(getPoolInstance(), 'public', {
        graphiql: true,
        enhanceGraphiql: true,
        watchPg: true,
        retryOnInitFail: true,
        jwtSecret: process.env.JWT_SECRET, // If using JWT
        appendPlugins: [customSchemaPlugin, ConnectionFilterPlugin],
        graphileBuildOptions: {
            pgOmitListSuffix: true,
            connectionFilterUseListInflectors: true,
            connectionFilterAllowedFieldTypes: ['String', 'Int', 'Boolean', 'Float', 'Date', 'time'],
            connectionFilterRelations: true,
            connectionFilterAllowedOperators: [
                'isNull',
                'equalTo',
                'notEqualTo',
                'distinctFrom',
                'notDistinctFrom',
                'lessThan',
                'lessThanOrEqualTo',
                'greaterThan',
                'greaterThanOrEqualTo',
                'in',
                'like',
                'notIn',
            ],
        },
        pgSettings: (req) => ({
            'jwt.claims.request_source': false,
            //@ts-ignore
            'jwt.claims.user_id': req.user && req.user.userId ? String(req.user.userId) : null,
        }),
        //@ts-ignore
        additionalGraphQLContextFromRequest(req) {
            //@ts-ignore
            return { user: req.user };
        },
    })
);

export default router;
