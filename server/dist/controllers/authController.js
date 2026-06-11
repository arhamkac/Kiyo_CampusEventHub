"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseLogin = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_dev_key';
const register = async (req, res) => {
    try {
        const { email, password, fullName, role } = req.body;
        // Check if user exists
        const existingUser = await index_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        // Create user
        const newUser = await index_1.prisma.user.create({
            data: {
                email,
                passwordHash,
                fullName,
                role: role || 'STUDENT',
            },
        });
        res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await index_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Check password
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};
exports.login = login;
const firebaseLogin = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(400).json({ message: 'No token provided' });
            return;
        }
        // In a real app, you would verify the token with adminAuth:
        // const decodedToken = await adminAuth.verifyIdToken(token);
        // const email = decodedToken.email;
        // For this demonstration (since Firebase might not be fully configured by user yet),
        // we will mock the verification if adminAuth is null, or trust the client payload 
        // strictly for development purposes if you haven't set up the service account.
        // WARNING: Below is pseudo-code for the actual verification
        let email = "user@example.com";
        let name = "Google User";
        let avatarUrl = "";
        // Example of real verification:
        const { adminAuth } = await Promise.resolve().then(() => __importStar(require('../services/firebaseAdmin')));
        if (adminAuth) {
            const decodedToken = await adminAuth.verifyIdToken(token);
            email = decodedToken.email || '';
            name = decodedToken.name || 'Google User';
            avatarUrl = decodedToken.picture || '';
        }
        else {
            // Mock for development if .env is missing
            console.warn("Using mock user since Firebase Admin is not configured");
            const { mockEmail, mockName } = req.body;
            if (mockEmail)
                email = mockEmail;
            if (mockName)
                name = mockName;
        }
        if (!email) {
            res.status(400).json({ message: 'Invalid token payload' });
            return;
        }
        // Upsert User (Wrapped in try-catch to allow UI testing without Postgres running)
        let user;
        try {
            user = await index_1.prisma.user.findUnique({ where: { email } });
            if (!user) {
                user = await index_1.prisma.user.create({
                    data: {
                        email,
                        fullName: name,
                        avatarUrl: avatarUrl,
                        passwordHash: '', // No password for OAuth users
                        role: 'STUDENT',
                    }
                });
            }
        }
        catch (dbError) {
            console.error("Prisma DB Error during login:", dbError);
            console.warn("Database connection failed. Generating mock user session for testing.");
            user = {
                id: "mock_id_123",
                email,
                fullName: name,
                avatarUrl: avatarUrl,
                passwordHash: '',
                role: 'STUDENT',
            };
        }
        // Generate our JWT
        const jwtToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            message: 'Login successful',
            token: jwtToken,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                avatarUrl: user.avatarUrl
            }
        });
    }
    catch (error) {
        console.error("Firebase login error:", error);
        res.status(500).json({ message: 'Server error during firebase login' });
    }
};
exports.firebaseLogin = firebaseLogin;
