"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const country_state_city_1 = require("country-state-city");
const { Schema } = mongoose_1.default;
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: (str) => validator_1.default.isEmail(str),
            message: (props) => `${props.value} is not a valid email address!`,
        },
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        validate: {
            validator: (value) => validator_1.default.isStrongPassword(value, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            }),
            message: (props) => `${props.value} is not a strong enough password!`,
        },
    },
    profilePictureURL: {
        type: String,
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    phoneNumber: {
        type: String,
        validate: {
            validator: (value) => validator_1.default.isMobilePhone(value, 'any'),
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    country: {
        type: String,
        validate: {
            validator: (value) => country_state_city_1.Country.getAllCountries().some((country) => country.name === value),
            message: (props) => `${props.value} is not a valid country!`,
        },
    },
    city: {
        type: String,
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
    birthDate: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
    },
    languagesSpoken: {
        type: [String],
        default: undefined,
    },
    interests: {
        type: [String],
        default: undefined,
    },
    bio: {
        type: String,
        minLength: 10,
    },
    favoriteTours: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'Tour',
    },
}, {
    timestamps: true,
});
// Signup static method
userSchema.statics.signup = async function (username, email, password) {
    if (!email || !password || !username) {
        throw Error('All fields must be filled');
    }
    if (!validator_1.default.isEmail(email)) {
        throw Error('Email is not valid');
    }
    if (!validator_1.default.isStrongPassword(password)) {
        throw Error('Password is not strong enough');
    }
    if (username.length < 3) {
        throw Error('Username must be at least 3 characters long');
    }
    const exists = await this.findOne({ email });
    if (exists) {
        throw Error('Email is already in use');
    }
    const salt = await bcrypt_1.default.genSalt(10);
    const hash = await bcrypt_1.default.hash(password, salt);
    const user = await this.create({ email, password: hash, username });
    return user;
};
// Login static method
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled');
    }
    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Incorrect email');
    }
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect password');
    }
    return user;
};
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
//# sourceMappingURL=userModel.js.map