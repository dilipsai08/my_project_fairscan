import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import './dot_env.js'; 
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from './config/Passport_strategies.js';
import * as authController from './src/Controllers/auth_controller.js';
import { isAuthenticated } from './src/middleware/auth.js'
import { Error_handler as errorHandler } from './src/middleware/error_handler.js';
import { OAuth_rate_limiter, Search_rate_limit, ai_rate_limit, ban_check } from './src/middleware/rate_limit.js';
import upload, { handleAiRequest } from './src/AI_Providers/Ai_request_handler.js';
import './src/AI_Providers/ai_queue.js';
import { queue_helper } from './src/AI_Providers/queue_helper.js';
import logger from './src/utils/logger.js';
import { health_tips } from './src/Services/health_tip_service.js';
import { search_handler } from './src/Services/search_submit.js';
import { getUserActivities } from './src/Models/db_queries.js';
import { medi_info_handler } from './src/Services/medicine_info_handler.js';
import { getProfile, getActivity } from './src/Services/profile_service.js';

const app = express();
const port = process.env.PORT || 3000;
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: [frontendURL],
    credentials: true,
}));

// global ban check
app.use(ban_check);

app.use(session({
    secret: process.env.SESSION_SECRET || "oauth_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 10 * 60 * 1000 } // 10 minutes 
}));

app.use(passport.initialize());
app.use(passport.session());

// dynamic oauth route
app.get('/auth/:provider', OAuth_rate_limiter, authController.oauthRedirect);
app.get('/auth/:provider/callback', OAuth_rate_limiter, authController.oauthCallback);
app.post('/api/auth/complete-profile', authController.completeProfile);

// for protected routes
app.get('/api/auth/verify-session', isAuthenticated, (req, res) => {
    return res.status(200).json({ loggedIn: true, user: req.user });
});


// Login submit endpoint
app.post('/api/login/submit', authController.loginSubmit);

// User info 
app.get('/api/user/info', isAuthenticated, (req, res) => {
    return res.status(200).json({ userName: req.user.name, savings: req.user.savings ,testscompared:req.user.cntsearch});
});

// profile section
app.get('/api/user/profile', isAuthenticated, getProfile);
app.get('/api/user/activity', isAuthenticated, getActivity);

// get health tips
app.get('/api/health-tips', health_tips);

// 4. Logout Endpoint
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// search test
app.post('/api/search-test', isAuthenticated, Search_rate_limit, search_handler);

// medicine info
app.get('/api/medicine/info', isAuthenticated, Search_rate_limit, medi_info_handler);

// AI query
app.post('/api/ai-chat-submit', upload.single('prescription'), ai_rate_limit, handleAiRequest);

// SSE 
app.get('/api/queue/status', queue_helper);

// for deployment use only 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../Frontend/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
});

// global error handler
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
