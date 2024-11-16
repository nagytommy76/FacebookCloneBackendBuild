"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateAddWorkplace = void 0;
const express_validator_1 = require("express-validator");
exports.ValidateAddWorkplace = [
    (0, express_validator_1.body)('city').trim().isLength({ min: 2 }).withMessage('A Város mezőnek minimum 2 karakternek kell lennie!'),
    (0, express_validator_1.body)('company').trim().isLength({ min: 2 }).withMessage('A Cég mező kitöltése kötelező!'),
    (0, express_validator_1.body)('post').trim().isLength({ min: 3 }).withMessage('A Pozíció mezőnek min 3 karakternek kell lennie!'),
    (0, express_validator_1.body)('fromDate').isLength({ min: 5 }).withMessage('A kezdeti idő mező teljes kitöltése kötelező!'),
    //    body('endDateChecked', 'toDate').custom((value: { endDateChecked: boolean; toDate: string }) => {
    //       console.log(value)
    //       if (value.endDateChecked === false && value.toDate === undefined) {
    //          throw new Error('A befejezés idő mező kitöltése kötelező!')
    //       }
    //       return true
    //    }),
];
