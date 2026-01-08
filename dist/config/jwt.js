"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
exports.JWT_EXPIRES_IN = '24h';
const generateToken = (userId) => {
    return (0, jsonwebtoken_1.sign)({ id: userId }, exports.JWT_SECRET, { expiresIn: exports.JWT_EXPIRES_IN });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        return (0, jsonwebtoken_1.verify)(token, exports.JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
