"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Prisma Client
exports.prisma = new client_1.PrismaClient();
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Kiyo Campus Event Hub API is running!' });
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/events', eventRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
