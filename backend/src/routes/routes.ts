import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { postgraphile } from 'postgraphile';
import {customSchemaPlugin} from "../resolver/customResolver";
import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import {authenticateToken, loginUser, logout, registerUser} from "../userLogin/loginUtils";
import {getPoolInstance} from "../db";


dotenv.config();
const router = express.Router();

// Route for user login
router.post('/login', loginUser)
router.post('/register', registerUser);
router.post('/logout', logout);
router.get('/protected', authenticateToken, (req, res) => {
    // @ts-ignore
    res.status(201).json({ message: 'Protected route accessed successfully', user: req.user });
});

// Apply authentication middleware to all routes except /login and /register
router.use((req: Request, res: Response, next) => {
    if (req.path === '/logout' || req.path === '/login' || req.path === '/register') {
        next();
    } else {
        next();
        // authenticateToken(req, res, next);
    }
});

// Mount PostGraphile middleware
// @ts-ignore
// @ts-ignore
router.use(postgraphile(getPoolInstance(), 'public', {
    graphiql: true,
    enhanceGraphiql: true,
    watchPg: true,
    retryOnInitFail: true,
    jwtSecret: process.env.JWT_SECRET, // If using JWT
    appendPlugins: [customSchemaPlugin, ConnectionFilterPlugin],
    graphileBuildOptions: {
        pgOmitListSuffix: true,
        connectionFilterUseListInflectors: true,
        connectionFilterAllowedFieldTypes: ["String", "Int", "Boolean", "Float",  "Date", "time"],
        connectionFilterRelations: true, // default: false
        connectionFilterAllowedOperators: [
            "isNull",
            "equalTo",
            "notEqualTo",
            "distinctFrom",
            "notDistinctFrom",
            "lessThan",
            "lessThanOrEqualTo",
            "greaterThan",
            "greaterThanOrEqualTo",
            "in",
            "like",
            "notIn",
        ],
    }, // Optionally omit the list suffix for better compatibility
    pgSettings: (req) => {
        // @ts-ignore
        return {
            'jwt.claims.request_source': false,

            // @ts-ignore
            'jwt.claims.user_id': req.user && req.user.userId ? String(req.user.userId) : null,
        }

    },
    // @ts-expect-error "error"
    additionalGraphQLContextFromRequest(req) {
        return {
            // @ts-ignore
            user: req.user,
        };
    }
}));


export default router;
