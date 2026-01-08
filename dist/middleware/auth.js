"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../config/jwt");
const User_1 = __importDefault(require("../models/User"));
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            return res.status(401).json({
                message: 'Authentication required'
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, jwt_1.JWT_SECRET);
        if (!decoded) {
            return res.status(403).json({
                message: 'Invalid token'
            });
        }
        const user = yield User_1.default.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Auth error:', error);
        res.status(403).json({
            message: 'Invalid or expired token'
        });
    }
});
exports.authenticate = authenticate;
