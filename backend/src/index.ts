import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import router from "./routes/routes";
import cors from "cors"
// Load environment variables from .env file
dotenv.config();
import i18next from './i18n';
i18next.changeLanguage(process.env.language);

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: process.env.frontendAddress, // Replace with your frontend address
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    credentials: true,
};

// Use the cors middleware with options
app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
