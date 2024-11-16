"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserController = void 0;
const user_1 = require("../../models/user/user");
const registerUserController = async (req, res) => {
    const sureName = req.body.sureName;
    const firstName = req.body.firstName;
    const email = req.body.email;
    const nativePassword = req.body.password;
    const dateOfBirth = req.body.dateOfBirth;
    const dateOfBirthString = new Date(dateOfBirth.year, dateOfBirth.month, dateOfBirth.day);
    const gender = req.body.gender;
    try {
        const hashedPassword = await user_1.User.encryptPassword(nativePassword);
        await user_1.User.create({
            email,
            firstName,
            sureName,
            password: hashedPassword,
            userDetails: {
                dateOfBirth: dateOfBirthString,
                gender,
            },
        });
        res.status(201).json({
            message: 'A regisztráció sikeres volt',
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.registerUserController = registerUserController;
