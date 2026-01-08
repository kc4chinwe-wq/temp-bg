"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.validateImageUpload = exports.validateSignUp = exports.validateLogin = void 0;
const express_validator_1 = require("express-validator");
exports.validateLogin = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email address.'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
];
exports.validateSignUp = [
    (0, express_validator_1.body)('username').notEmpty().withMessage('Username is required.'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email address.'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
];
exports.validateImageUpload = [
    (0, express_validator_1.body)('caption').notEmpty().withMessage('Caption is required.'),
];
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
