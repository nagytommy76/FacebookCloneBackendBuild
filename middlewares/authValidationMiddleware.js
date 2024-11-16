"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const authValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() });
    }
    next();
};
exports.authValidationMiddleware = authValidationMiddleware;
