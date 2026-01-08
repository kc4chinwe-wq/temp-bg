"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const users_1 = require("../controllers/users");
const router = express_1.default.Router();
// Define profile route
router.get('/profile', auth_1.authenticate, users_1.getProfile);
exports.default = router;
