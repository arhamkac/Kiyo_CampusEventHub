"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize Firebase Admin only if env variables are present to prevent crashes
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    try {
        if ((0, app_1.getApps)().length === 0) {
            (0, app_1.initializeApp)({
                credential: (0, app_1.cert)({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    // Handle escaped newlines in private key
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                }),
            });
        }
        console.log('Firebase Admin initialized successfully');
    }
    catch (error) {
        console.error('Firebase Admin initialization error', error);
    }
}
else {
    console.warn('Firebase Admin is not initialized. Please set FIREBASE_* env variables.');
}
exports.adminAuth = (0, app_1.getApps)().length > 0 ? (0, auth_1.getAuth)() : null;
