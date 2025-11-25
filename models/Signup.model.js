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
    // firstName: {
    //     type: String,
    //     required: true,
    //     lowercase: true,
    //     trim: true,
    //    validate: {
    //     validator: v => /^[A-Za-z][A-Za-z0-9]{2,9}$/.test(v),
    //     message: "Only letters & numbers, 5–10 characters"
    // }

    // },
    Username: {
        type: String,
        lowercase: true,
        trim: true,
        required: function () {
            return !this.GoogleId;
        },
     validate: {
        validator: v => /^[A-Za-z][A-Za-z0-9]{2,9}$/.test(v),
        message: "Only letters & numbers, 5–10 characters"
    }
    },
   Email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
        validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Invalid email format"
    }
},

 password: {
    type: String,
    required: function () { return !this.GoogleId },
    validate: {
        validator: v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/.test(v),
        message: "Password must be 8–20 chars, include upper, lower, number & special"
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

