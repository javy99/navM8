"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavoriteTours = exports.deleteFavoriteTour = exports.addFavoriteTour = exports.getAllUsers = exports.deleteProfilePhoto = exports.getProfilePhoto = exports.uploadProfilePhoto = exports.getProfile = exports.updateProfile = void 0;
const bcrypt = __importStar(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
const validator_1 = __importDefault(require("validator"));
const cloudinary_1 = require("cloudinary");
const country_state_city_1 = require("country-state-city");
const models_1 = require("../models");
dotenv.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const updateProfile = async (req, res) => {
    const { firstName, lastName, phoneNumber, email, country, city, birthDate, gender, languagesSpoken, interests, bio, currentPassword, newPassword, } = req.body;
    if (!req.user?._id) {
        res.status(400).json({ error: 'User ID missing from request.' });
        return;
    }
    try {
        const user = await models_1.User.findById(req.user._id);
        if (!user) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }
        if (country && !country_state_city_1.Country.getAllCountries().some((c) => c.name === country)) {
            throw Error('Invalid country');
        }
        if (city) {
            const countryObj = country_state_city_1.Country.getAllCountries().find((c) => c.name === country);
            if (!countryObj ||
                !country_state_city_1.City.getCitiesOfCountry(countryObj.isoCode).some((c) => c.name === city)) {
                throw Error('Invalid city');
            }
        }
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.email = email || user.email;
        user.country = country || user.country;
        user.city = city || user.city;
        user.birthDate = birthDate || user.birthDate;
        user.gender = gender || user.gender;
        user.languagesSpoken = languagesSpoken || user.languagesSpoken;
        user.interests = interests || user.interests;
        user.bio = bio || user.bio;
        if (currentPassword && newPassword) {
            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match)
                throw Error('Current password is incorrect');
            if (!validator_1.default.isStrongPassword(newPassword)) {
                throw Error('New password is not strong enough');
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'An unexpected error occurred' });
        }
    }
};
exports.updateProfile = updateProfile;
const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json(req.user);
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getProfile = getProfile;
const uploadProfilePhoto = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    const fileType = req.file.mimetype;
    const fileSize = req.file.size;
    if (!['image/jpg', 'image/jpeg', 'image/png'].includes(fileType) ||
        fileSize > 1024 * 1024 * 5) {
        return res.status(400).json({ error: 'Invalid file type or size.' });
    }
    if (!req.user?._id) {
        return res.status(400).json({ error: 'User authentication failed.' });
    }
    try {
        const result = await cloudinary_1.v2.uploader.upload(req.file.path, {
            folder: 'userProfilePhotos',
            secure: true,
            resource_type: 'image',
        });
        const updatedUser = await models_1.User.findByIdAndUpdate(req.user._id, { profilePictureURL: result.secure_url }, { new: true });
        console.log('updatedUser:', updatedUser);
        res.json({
            message: 'Profile photo uploaded successfully',
            profilePictureURL: result.secure_url,
        });
    }
    catch (error) {
        console.error('Error uploading profile photo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.uploadProfilePhoto = uploadProfilePhoto;
const getProfilePhoto = async (req, res) => {
    try {
        const user = await models_1.User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const profilePictureURL = user.profilePictureURL || null;
        res.status(200).json({ profilePictureURL });
    }
    catch (error) {
        console.error('Error fetching profile photo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getProfilePhoto = getProfilePhoto;
const deleteProfilePhoto = async (req, res) => {
    try {
        const user = await models_1.User.findById(req.user._id);
        if (!user || !user.profilePictureURL) {
            return res.status(404).json({ error: 'Profile photo not found.' });
        }
        const urlParts = user.profilePictureURL.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const publicId = `userProfilePhotos/${fileName.split('.')[0]}`;
        const result = await cloudinary_1.v2.uploader.destroy(publicId);
        if (result.result !== 'ok') {
            throw new Error('Failed to delete image from Cloudinary.');
        }
        user.profilePictureURL = '';
        await user.save();
        res.status(200).json({ message: 'Profile photo deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting profile photo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteProfilePhoto = deleteProfilePhoto;
// Search users
const getAllUsers = async (req, res) => {
    try {
        const { search } = req.query;
        let queryObj = {};
        if (search) {
            queryObj = {
                $or: [
                    { email: new RegExp(search.toString(), 'i') },
                    { firstName: new RegExp(search.toString(), 'i') },
                ],
            };
        }
        const users = await models_1.User.find(queryObj);
        res.json(users);
    }
    catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllUsers = getAllUsers;
const addFavoriteTour = async (req, res) => {
    const userId = req.params.id;
    const { tourId } = req.body;
    try {
        const user = await models_1.User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found.');
        }
        if (user.favoriteTours.includes(tourId)) {
            return res.status(400).send('Tour is already in favorites.');
        }
        user.favoriteTours.push(tourId);
        await user.save();
        res.status(200).json({
            message: 'Tour added to favorites successfully.',
            favoriteTours: user.favoriteTours,
        });
    }
    catch (error) {
        console.error('Error adding tour to favorites:', error);
        res.status(500).send('Error adding tour to favorites.');
    }
};
exports.addFavoriteTour = addFavoriteTour;
const deleteFavoriteTour = async (req, res) => {
    const userId = req.params.id;
    const { tourId } = req.params;
    try {
        const updateResult = await models_1.User.findByIdAndUpdate(userId, {
            $pull: { favoriteTours: tourId },
        }, { new: true });
        if (!updateResult) {
            return res
                .status(404)
                .send('User not found or tour was not in favorites.');
        }
        res.status(200).json({
            message: 'Tour removed from favorites successfully.',
            favoriteTours: updateResult.favoriteTours,
        });
    }
    catch (error) {
        console.error('Error removing tour from favorites:', error);
        res.status(500).send('Error removing tour from favorites.');
    }
};
exports.deleteFavoriteTour = deleteFavoriteTour;
const getFavoriteTours = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await models_1.User.findById(userId)
            .populate('favoriteTours')
            .populate({
            path: 'favoriteTours',
            populate: { path: 'author' },
        })
            .exec();
        if (!user) {
            return res.status(404).send('User not found.');
        }
        res.json(user.favoriteTours);
    }
    catch (error) {
        console.error('Error fetching favorite tours:', error);
        res.status(500).send('Error fetching favorite tours.');
    }
};
exports.getFavoriteTours = getFavoriteTours;
//# sourceMappingURL=userControllers.js.map