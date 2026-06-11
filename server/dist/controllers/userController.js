"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.getAllUsers = void 0;
const index_1 = require("../index");
const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        const users = await index_1.prisma.user.findMany({
            select: { id: true, email: true, fullName: true, role: true }
        });
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};
exports.getAllUsers = getAllUsers;
const updateUserRole = async (req, res) => {
    try {
        // if (req.user!.role !== 'ORGANIZER' && req.user!.role !== 'ADMIN') {
        //   res.status(403).json({ message: 'Forbidden' });
        //   return;
        // }
        const id = req.params.id;
        const { role } = req.body;
        const updatedUser = await index_1.prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, email: true, fullName: true, role: true }
        });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating role' });
    }
};
exports.updateUserRole = updateUserRole;
