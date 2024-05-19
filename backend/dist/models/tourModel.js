"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tour = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const country_state_city_1 = require("country-state-city");
const { Schema } = mongoose_1.default;
const tourSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
        validate: {
            validator: (value) => country_state_city_1.Country.getAllCountries().some((country) => country.name === value),
            message: (props) => `${props.value} is not a valid country!`,
        },
    },
    city: {
        type: String,
        required: true,
        validate: {
            validator(value) {
                const countryObj = country_state_city_1.Country.getAllCountries().find((country) => country.name === this.get('country'));
                if (countryObj) {
                    return country_state_city_1.City.getCitiesOfCountry(countryObj.isoCode).some((city) => city.name === value);
                }
                return false;
            },
            message: (props) => `${props.value} is not a valid city!`,
        },
    },
    maxPeople: {
        type: String,
        required: true,
    },
    typeOfAvailability: {
        type: String,
        required: true,
        enum: ['recurring', 'one-time'],
    },
    availability: {
        type: String,
        required() {
            return this.typeOfAvailability === 'recurring';
        },
        validate: {
            validator(value) {
                if (this.typeOfAvailability === 'recurring') {
                    const validAvailabilities = ['weekdays', 'weekends', 'daily'];
                    return validAvailabilities.includes(value);
                }
                return true;
            },
            message: (props) => `${props.value} is not a valid recurring availability option.`,
        },
    },
    date: {
        type: String,
        required() {
            return this.typeOfAvailability === 'one-time';
        },
        validate: {
            validator(value) {
                if (this.typeOfAvailability === 'one-time') {
                    const inputDate = new Date(value);
                    inputDate.setHours(0, 0, 0, 0);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return inputDate >= tomorrow;
                }
                return true;
            },
            message: 'The date must be from tomorrow onwards.',
        },
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        minLength: 10,
        required: true,
    },
    photos: {
        type: [String],
        required: true,
        validate: {
            validator(value) {
                return value.length > 0;
            },
            message: 'At least one photo is required.',
        },
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    reviewCount: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
});
const Tour = mongoose_1.default.model('Tour', tourSchema);
exports.Tour = Tour;
//# sourceMappingURL=tourModel.js.map