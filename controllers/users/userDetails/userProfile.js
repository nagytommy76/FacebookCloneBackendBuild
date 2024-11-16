"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSingleWorkplace = exports.addNewWorkplaceController = void 0;
const express_validator_1 = require("express-validator");
const user_1 = require("../../../models/user/user");
const addNewWorkplaceController = async (request, response) => {
    const result = (0, express_validator_1.validationResult)(request);
    if (!result.isEmpty()) {
        return response.status(404).json({ errors: result.array() });
    }
    try {
        const userId = request.user?.userId;
        const { city, company, post, description, endDateChecked, fromDate, toDate } = request.body;
        const savedUserWorlplace = await user_1.User.findById(userId).select('userDetails.workPlaces');
        savedUserWorlplace?.userDetails.workPlaces.push({
            city,
            companyName: company,
            description,
            position: post,
            startDate: fromDate,
            endDate: toDate || null,
        });
        const saved = await savedUserWorlplace?.save();
        response.status(200).json({ savedUserWorlplace: savedUserWorlplace?.userDetails.workPlaces, saved });
    }
    catch (error) {
        console.log(error);
        return response.status(500).json(error);
    }
};
exports.addNewWorkplaceController = addNewWorkplaceController;
const removeSingleWorkplace = async (request, response) => {
    const { workId } = request.body;
    const userId = request.user?.userId;
    try {
        const foundUsersWorkplaces = await user_1.User.findOne({ _id: userId }).select('userDetails.workPlaces');
        if (!foundUsersWorkplaces)
            return response.status(404).json({ msg: 'User not found' });
        const removedWorkPlace = foundUsersWorkplaces.userDetails.workPlaces.filter((work) => work._id != workId);
        foundUsersWorkplaces.userDetails.workPlaces = removedWorkPlace;
        foundUsersWorkplaces.save();
        return response.status(200).json({ msg: 'deleted' });
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};
exports.removeSingleWorkplace = removeSingleWorkplace;
