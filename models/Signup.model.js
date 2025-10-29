import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { Schema } from 'mongoose';
// import { types } from 'util';

const SingupSchema = new Schema({
    GoogleId: {
        type: String,
        required: false,
        unique: true,
        sparse : true,

    },
    firstName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    lastName: {
        type: String,
        lowercase: true,
        trim: true,
        required: function () {
            return !this.GoogleId;
        },
       
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
       required: function () {
            return !this.GoogleId; // password only required if not Google user
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
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

    }

}, { timestamps: true });


SingupSchema.pre('save', async function (next) {

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
            firstName: this.firstName
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
            firstName: this.firstName
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

    this.resetTokenExpiry = Date.now() + 10 * 60 * 1000;

    return resetToken

}

SingupSchema.methods.generateOtpCode = async function () {

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    this.otpCode = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex")

    this.otpExpiry = Date.now() + 5 * 60 * 1000;

    return otp
}

const User = mongoose.model('User', SingupSchema)

export default User;

