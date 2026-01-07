import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { Schema } from 'mongoose';
import { type } from 'os';
// import { types } from 'util';

const SingupSchema = new Schema({
    GoogleId: {
        type: String,
        required: false,
        unique: true,
        sparse: true,

    },

    Email: {
        type: String,
        required: function () { return !this.GoogleId },
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: "Invalid email format"
        }
    },
    Username: {
        type: String,
        lowercase: true,
        trim: true,
        required: function () { return !this.GoogleId; },
        validate: {
            validator: v => !v || /^[A-Za-z][A-Za-z0-9]{2,9}$/.test(v),
            message: "Only letters & numbers, 5–10 characters"
        }
    },
    password: {
        type: String,
        validate: {
            validator: function (v) {
                if (!v && !this.GoogleId) return false; // require password if no GoogleId
                if (!v && this.GoogleId) return true;   // skip validation for OAuth
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,20}$/.test(v);
            },
            message: 'Password must be 8–20 chars, include upper, lower, number & special'
        }
    }
    ,


    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    emailVerified: {
        type: Boolean,
        default: false
    },

    refreshToken: {
        type: String
    },
    resetPasswordToken: String,
    resetTokenExpiry: Date,

    otpCode: String,
    otpExpiry: Date,
    isValid: {
        type: Boolean,
        default: false

    },
    status: {
        type: String,
        enum: ["active", "inactive", "banned"],
        default: "active"
    },
    lastLoginAt: {
        type: Date
    }

}, { timestamps: true });


SingupSchema.pre('save', async function (next) {
    if (!this.password) return next() 
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

SingupSchema.methods.isCorrectPassword = async function (password) {

    return await bcrypt.compare(password, this.password)

}

SingupSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            id: this._id,
            // firstName: this.firstName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

SingupSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            id: this._id,
            // firstName: this.firstName,
        },

        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

};

SingupSchema.methods.generateResetPasswordToken = async function () {

    const resetToken = crypto.randomBytes(32).toString("hex")

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")


    const expiryMinutes = Number(process.env.RESET_PASSWORD_EXPIRY) || 10;
    this.resetTokenExpiry = Date.now() + expiryMinutes * 60 * 1000;

    return resetToken

}

SingupSchema.methods.generateOtpCode = async function () {

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    this.otpCode = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex")

    const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES) || 5;
    this.otpExpiry = Date.now() + expiryMinutes * 60 * 1000;


    return otp
}

const User = mongoose.model('User', SingupSchema)

export default User;

