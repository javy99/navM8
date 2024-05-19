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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTours = exports.deleteTour = exports.updateTour = exports.getTour = exports.getMyTours = exports.createTour = exports.getAllTours = void 0;
const dotenv = __importStar(require("dotenv"));
const cloudinary_1 = require("cloudinary");
const models_1 = require("../models");
dotenv.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
async function uploadTourImageToCloudinary(filePath) {
    try {
        const result = await cloudinary_1.v2.uploader.upload(filePath, {
            folder: 'tourPhotos',
        });
        return result.secure_url;
    }
    catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
    }
}
const getAllTours = async (req, res) => {
    try {
        const tours = await models_1.Tour.find().populate('author').exec();
        res.json(tours);
    }
    catch (error) {
        console.error('Error fetching tours:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllTours = getAllTours;
const createTour = async (req, res) => {
    try {
        const { name, country, city, maxPeople, typeOfAvailability, availability, date, from, to, description, } = req.body;
        const files = req.files ?? [];
        const imageUrls = await Promise.all(files.map((file) => uploadTourImageToCloudinary(file.path)));
        const tour = new models_1.Tour({
            name,
            country,
            city,
            maxPeople,
            typeOfAvailability,
            availability,
            date,
            from,
            to,
            description,
            photos: imageUrls,
            author: req.user._id,
        });
        await tour.save();
        res.status(201).json(tour);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
};
exports.createTour = createTour;
const getMyTours = async (req, res) => {
    try {
        const userTours = await models_1.Tour.find({ author: req.user._id })
            .populate('author')
            .exec();
        res.json(userTours);
    }
    catch (error) {
        console.error('Error fetching user tours:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getMyTours = getMyTours;
const getTour = async (req, res) => {
    try {
        const tour = await models_1.Tour.findById(req.params.id).populate('author').exec();
        if (!tour) {
            res.status(404).json({ error: 'Tour not found' });
            return;
        }
        res.json(tour);
    }
    catch (error) {
        console.error('Error fetching tour:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getTour = getTour;
const updateTour = async (req, res) => {
    try {
        const { name, country, city, maxPeople, typeOfAvailability, availability, date, from, to, description, } = req.body;
        const tourId = req.params.id;
        const tour = await models_1.Tour.findById(tourId);
        if (!tour) {
            res.status(404).json({ error: 'Tour not found' });
            return;
        }
        // Check if the user is authorized to edit the tour
        if (tour.author.toString() !== req.user._id.toString()) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }
        // Update tour fields
        tour.name = name;
        tour.country = country;
        tour.city = city;
        tour.maxPeople = maxPeople;
        tour.typeOfAvailability = typeOfAvailability;
        tour.availability = availability;
        tour.date = date;
        tour.from = from;
        tour.to = to;
        tour.description = description;
        await tour.save();
        res.json(tour);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
};
exports.updateTour = updateTour;
const deleteTour = async (req, res) => {
    try {
        const tourId = req.params.id;
        const tour = await models_1.Tour.findById(tourId);
        if (!tour) {
            res.status(404).json({ error: 'Tour not found' });
            return;
        }
        if (tour.author.toString() !== req.user._id.toString()) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }
        await models_1.Tour.deleteOne({ _id: tourId });
        res.json({ message: 'Tour deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteTour = deleteTour;
const getUserTours = async (req, res) => {
    try {
        const tours = await models_1.Tour.find({ author: req.params.id })
            .populate('author')
            .exec();
        res.json(tours);
    }
    catch (error) {
        console.error('Error fetching user tours:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getUserTours = getUserTours;
//# sourceMappingURL=tourControllers.js.map