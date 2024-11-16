"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateLogin = exports.ValidateRegister = void 0;
const express_validator_1 = require("express-validator");
const user_1 = require("../../../models/user/user");
exports.ValidateRegister = [
    (0, express_validator_1.body)('sureName').trim().isLength({ min: 1 }).withMessage('A Vezetéknév mező kitöltése kötelező!'),
    (0, express_validator_1.body)('firstName').trim().isLength({ min: 1 }).withMessage('A Keresztnév mező kitöltése kötelező!'),
    (0, express_validator_1.body)('email').trim().normalizeEmail().isEmail().withMessage('Nem megfelelő formátumú az email cím!'),
    (0, express_validator_1.body)('email').custom(async (email) => {
        const checkUserRegisteredWithEmail = await user_1.User.findOne({ email });
        if (email.length <= 3) {
            throw new Error('Az email mező kitöltése kötelező!');
        }
        else if (checkUserRegisteredWithEmail !== null) {
            throw new Error('Ezzel az email címmel már regisztráltak!');
        }
        return true;
    }),
    (0, express_validator_1.body)('password').trim().isLength({ min: 3 }).withMessage('A jelszónak min 3 karakternek kell lennie!'),
    (0, express_validator_1.body)('dateOfBirth').custom((value) => {
        if (value.day === '' || value.month === '' || value.year === '') {
            throw new Error('Kérlek töltsd ki a születési időt!');
        }
        return true;
    }),
];
exports.ValidateLogin = [
    (0, express_validator_1.body)('email')
        .custom(async (email) => {
        const checkUserRegisteredWithEmail = await user_1.User.findOne({ email });
        if (email.length <= 3) {
            throw new Error('Az email mező kitöltése kötelező!');
        }
        else if (checkUserRegisteredWithEmail === null) {
            throw new Error('Ez az email cím még nincs regisztrálva!');
        }
        return true;
    })
        .normalizeEmail()
        .isEmail()
        .withMessage('Az email cím nem megfelelő formátumú!'),
    (0, express_validator_1.body)('password').trim().isLength({ min: 3 }).withMessage('A jelszónak min 3 karakternek kell lennie!'),
];
